import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

interface LandItem { [k: string]: any }

/* 토지(대지·답·임야 등) 매매 실거래가 API */
const API_PATH =
  '/1613000/RTMSDataSvcLandTrade/getRTMSDataSvcLandTrade';

/** YYYYMMDD → YYYY-MM-DD, 유효하지 않으면 null */
const safeDate = (v?: string) =>
  v && /^\d{8}$/.test(v) && dayjs(v, 'YYYYMMDD', true).isValid()
    ? dayjs(v, 'YYYYMMDD').format('YYYY-MM-DD')
    : null;

export default factories.createCoreService(
  'api::cm-trade-sales-land.cm-trade-sales-land',
  ({ strapi }) => {
    const tradeType = 'sales_land' as const;

    return {
      /* ────────────────────────────────────────────
         1. 한 페이지(최대 1,000건) 동기화
      ──────────────────────────────────────────── */
      async syncSalesLand(
        siguCd: string,    // 시군구 5자리
        dealYmd: string,   // YYYYMM
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[sales_land] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
        );

        const { data } = await axios.get(API_PATH, {
          baseURL: 'http://apis.data.go.kr',
          params: {
            LAWD_CD: siguCd,
            DEAL_YMD: dealYmd,
            pageNo,
            numOfRows,
            _type: 'json',
            serviceKey: process.env.DATAGOKR_API_KEY,
          },
          timeout: 900_000,
        });

        const items: LandItem[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[sales_land] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
        );
        if (!items.length) return 0;

        for (const v of items) {
          const dealDate = v.dealYear
            ? dayjs(`${v.dealYear}-${v.dealMonth}-${v.dealDay}`, 'YYYY-M-D')
                .format('YYYY-MM-DD')
            : null;
          const dealAmt = Number(String(v.dealAmount).replace(/,/g, ''));

          const payload: any = {
            sales_land_uniq_code: [
              v.sggCd,
              v.umdNm,
              v.jibun,
              v.jimok ?? v.lnduseCdNm ?? '',
              dealDate ?? '',
              dealAmt,
            ].join('-'),

            sales_land_region_code: String(v.sggCd),
            sales_land_umd_name: v.umdNm,
            sales_land_jibun: String(v.jibun),
            sales_land_jimok: v.jimok ?? v.lnduseCdNm ?? null,
            sales_land_use: v.lndcgrCodeNm ?? null,
            sales_land_deal_ymd: dealDate,
            sales_land_deal_amount: dealAmt,
            sales_land_cdeal: v.cdealType === 'O' ? 1 : 0,
            sales_land_cdeal_day: safeDate(v.cdealDay),
            sales_land_deal_type: v.dealingGbn,
            sales_land_estate_agency: v.estateAgentSggNm,
            sales_land_share_dealing_type: v.shareDealType ?? null,

            sales_land_api_called_at: dayjs().toISOString(),
            sales_land_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-sales-land.cm-trade-sales-land')
            .findMany({
              filters: { sales_land_uniq_code: payload.sales_land_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-sales-land.cm-trade-sales-land')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-sales-land.cm-trade-sales-land')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ────────────────────────────────────────────
         2. 코드·연월 전체 페이지 동기화 (추가)
      ──────────────────────────────────────────── */
      async syncSalesLandByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[sales_land] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncSalesLand(siguCd, dealYmd, page);
          if (rows < 1000) break;     // 마지막 페이지
        }
        strapi.log.info(
          `[sales_land] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
        );
      },

      /* ────────────────────────────────────────────
         3. nextTarget 기반 배치 동기화 (기존 로직)
      ──────────────────────────────────────────── */
      async syncNextBatch() {
        const apiCalledSvc = strapi.service(
          'api::cm-trade-api-called.cm-trade-api-called',
        );
        const target = await apiCalledSvc.nextTargetOrCreate(tradeType);
        if (!target) {
          strapi.log.info('[sales_land] 모든 대상 완료');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[sales_land] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncSalesLand(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[sales_land] ▶ 배치 완료 → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
