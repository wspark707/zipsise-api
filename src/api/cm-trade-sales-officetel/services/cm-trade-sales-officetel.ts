import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

interface OffiItem { [k: string]: any }

/* 오피스텔 매매 실거래가 API */
const API_PATH =
  '/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade';

const safeDate = (v?: string) =>
  v && /^\d{8}$/.test(v) && dayjs(v, 'YYYYMMDD', true).isValid()
    ? dayjs(v, 'YYYYMMDD').format('YYYY-MM-DD')
    : null;

export default factories.createCoreService(
  'api::cm-trade-sales-officetel.cm-trade-sales-officetel',
  ({ strapi }) => {
    const tradeType = 'sales_officetel' as const;

    return {
      /* ────────────────────────────────────────────
         1. 한 페이지(최대 1,000건) 동기화
      ──────────────────────────────────────────── */
      async syncSalesOfficetel(
        siguCd: string,     // 시군구 5자리
        dealYmd: string,    // YYYYMM
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[sales_officetel] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
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

        const items: OffiItem[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[sales_officetel] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
        );
        if (!items.length) return 0;

        for (const v of items) {
          const dealDate = v.dealYear
            ? dayjs(`${v.dealYear}-${v.dealMonth}-${v.dealDay}`, 'YYYY-M-D')
                .format('YYYY-MM-DD')
            : null;
          const dealAmt = Number(String(v.dealAmount).replace(/,/g, ''));

          const payload: any = {
            sales_officetel_uniq_code: [
              v.sggCd, v.umdNm, v.bldgNm, v.jibun, v.excluUseAr,
              dealDate ?? '', dealAmt, v.floor,
              v.rgstDate ?? '', v.cdealDay ?? '',
            ].join('-'),

            sales_officetel_region_code: String(v.sggCd),
            sales_officetel_umd_name: v.umdNm,
            sales_officetel_name: v.bldgNm,
            sales_officetel_jibun: String(v.jibun),
            sales_officetel_use_area: String(v.excluUseAr),
            sales_officetel_deal_ymd: dealDate,
            sales_officetel_deal_amount: dealAmt,
            sales_officetel_floor: String(v.floor),
            sales_officetel_build_year: String(v.buildYear),
            sales_officetel_cdeal: v.cdealType === 'O' ? 1 : 0,
            sales_officetel_cdeal_day: safeDate(v.cdealDay),
            sales_officetel_deal_type: v.dealingGbn,
            sales_officetel_estate_agency: v.estateAgentSggNm,
            sales_officetel_seller: v.sellerGbn ?? null,
            sales_officetel_buyer: v.buyerGbn ?? null,

            sales_officetel_api_called_at: dayjs().toISOString(),
            sales_officetel_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-sales-officetel.cm-trade-sales-officetel')
            .findMany({
              filters: { sales_officetel_uniq_code: payload.sales_officetel_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-sales-officetel.cm-trade-sales-officetel')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-sales-officetel.cm-trade-sales-officetel')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ────────────────────────────────────────────
         2. (추가) 코드·연월 전체 페이지 동기화
      ──────────────────────────────────────────── */
      async syncSalesOfficetelByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[sales_officetel] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncSalesOfficetel(siguCd, dealYmd, page);
          if (rows < 1000) break;      // 마지막 페이지
        }
        strapi.log.info(
          `[sales_officetel] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
        );
      },

      /* ────────────────────────────────────────────
         3. 기존 nextTarget 기반 배치 동기화
      ──────────────────────────────────────────── */
      async syncNextBatch() {
        const apiCalledSvc = strapi.service(
          'api::cm-trade-api-called.cm-trade-api-called',
        );
        const target = await apiCalledSvc.nextTargetOrCreate(tradeType);
        if (!target) {
          strapi.log.info('[sales_officetel] 모든 대상 완료');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[sales_officetel] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncSalesOfficetel(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[sales_officetel] ▶ 배치 완료 → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
