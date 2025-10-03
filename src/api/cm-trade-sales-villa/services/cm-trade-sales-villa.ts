import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface VillaItem { [k: string]: any }

/* 다가구·다가세대(연립/빌라) 매매 실거래가 API */
const API_PATH =
  '/1613000/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade';

const safeDate = (v?: string) =>
  v && /^\d{8}$/.test(v) && dayjs(v, 'YYYYMMDD', true).isValid()
    ? dayjs(v, 'YYYYMMDD').format('YYYY-MM-DD')
    : null;

export default factories.createCoreService(
  'api::cm-trade-sales-villa.cm-trade-sales-villa',
  ({ strapi }) => {
    const tradeType = 'sales_villa' as const;

    return {
      /* ────────────────────────────────────────────
         1. 한 페이지(최대 1,000건) 동기화
      ──────────────────────────────────────────── */
      async syncSalesVilla(
        siguCd: string,      // 시군구 5자리
        dealYmd: string,     // YYYYMM
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[sales_villa] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
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

        const items: VillaItem[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[sales_villa] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
        );
        if (!items.length) return 0;

        for (const v of items) {
          const dealDate = v.dealYear
            ? dayjs(`${v.dealYear}-${v.dealMonth}-${v.dealDay}`, 'YYYY-M-D')
                .format('YYYY-MM-DD')
            : null;
          const dealAmt = Number(String(v.dealAmount).replace(/,/g, ''));

          const payload: any = {
            sales_villa_uniq_code: [
              v.sggCd, v.umdNm, v.bldgNm, v.jibun, v.excluUseAr,
              dealDate ?? '', dealAmt, v.floor,
              v.rgstDate ?? '', v.cdealDay ?? '',
            ].join('-'),

            sales_villa_region_code: String(v.sggCd),
            sales_villa_umd_name: v.umdNm,
            sales_villa_name: v.bldgNm,
            sales_villa_jibun: String(v.jibun),
            sales_villa_use_area: String(v.excluUseAr),
            sales_villa_deal_ymd: dealDate,
            sales_villa_deal_amount: dealAmt,
            sales_villa_floor: String(v.floor),
            sales_villa_build_year: String(v.buildYear),
            sales_villa_cdeal: v.cdealType === 'O' ? 1 : 0,
            sales_villa_cdeal_day: safeDate(v.cdealDay),
            sales_villa_deal_type: v.dealingGbn,
            sales_villa_estate_agency: v.estateAgentSggNm,
            sales_villa_regist_date: safeDate(v.rgstDate),
            sales_villa_dong: v.dongNm ?? v.umdNm,
            sales_villa_seller: v.sellerGbn ?? null,
            sales_villa_buyer: v.buyerGbn ?? null,
            sales_villa_house_type: v.houseType ?? null,
            sales_villa_land_area: String(v.landAr ?? ''),

            sales_villa_api_called_at: dayjs().toISOString(),
            sales_villa_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-sales-villa.cm-trade-sales-villa')
            .findMany({
              filters: { sales_villa_uniq_code: payload.sales_villa_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-sales-villa.cm-trade-sales-villa')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-sales-villa.cm-trade-sales-villa')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ────────────────────────────────────────────
         2. (추가) 코드·연월 전체 페이지 동기화
      ──────────────────────────────────────────── */
      async syncSalesVillaByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[sales_villa] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncSalesVilla(siguCd, dealYmd, page);
          if (rows < 1000) break;      // 마지막 페이지
        }
        strapi.log.info(
          `[sales_villa] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
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
          strapi.log.info('[sales_villa] 모든 대상 완료');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[sales_villa] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncSalesVilla(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[sales_villa] ▶ 배치 완료 → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
