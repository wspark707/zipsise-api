import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

interface VillaRentItem { [k: string]: any }

/* 연립‧다가구(빌라) 전·월세 실거래가 API */
const API_PATH =
  '/1613000/RTMSDataSvcRHRent/getRTMSDataSvcRHRent';

/** YYYYMMDD → YYYY-MM-DD, 유효하지 않으면 null */
const safeDate = (v?: string) =>
  v && /^\d{8}$/.test(v) && dayjs(v, 'YYYYMMDD', true).isValid()
    ? dayjs(v, 'YYYYMMDD').format('YYYY-MM-DD')
    : null;

export default factories.createCoreService(
  'api::cm-trade-rent-villa.cm-trade-rent-villa',
  ({ strapi }) => {
    const tradeType = 'rent_villa' as const;

    return {
      /* ────────────────────────────────────────────
         1. 한 페이지(최대 1,000건) 동기화
      ──────────────────────────────────────────── */
      async syncRentVilla(
        siguCd: string,    // 시군구 5자리
        dealYmd: string,   // YYYYMM
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[rent_villa] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
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

        const items: VillaRentItem[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[rent_villa] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
        );
        if (!items.length) return 0;

        for (const v of items) {
          const contDate = v.dealYear
            ? dayjs(`${v.dealYear}-${v.dealMonth}-${v.dealDay}`, 'YYYY-M-D')
                .format('YYYY-MM-DD')
            : null;

          const deposit = Number(String(v.deposit).replace(/,/g, '') || 0);
          const rent    = Number(String(v.monthlyRent).replace(/,/g, '') || 0);

          const payload: any = {
            rent_villa_uniq_code: [
              v.sggCd,
              v.umdNm,
              v.houseType ?? '',
              v.jibun,
              v.excluUseAr ?? '',
              contDate ?? '',
              deposit,
              rent,
            ].join('-'),

            rent_villa_region_code: String(v.sggCd),
            rent_villa_umd_name: v.umdNm,
            rent_villa_name: v.bldgNm ?? null,
            rent_villa_house_type: v.houseType ?? null,
            rent_villa_jibun: String(v.jibun),
            rent_villa_use_area: String(v.excluUseAr ?? ''),
            rent_villa_deal_ymd: contDate,
            rent_villa_deposit: deposit,
            rent_villa_monthly_rent: rent,
            rent_villa_floor: String(v.floor ?? ''),
            rent_villa_build_year: String(v.buildYear ?? ''),
            rent_villa_contract_term: v.contTerm ?? null,
            rent_villa_contract_type: v.rentGbnNm ?? null,
            rent_villa_use_right: v.rightGbnNm ?? null,
            rent_villa_pre_deposit: v.prevDeposit ?? null,
            rent_villa_pre_monthly_rent: v.prevMonthlyRent ?? null,

            rent_villa_api_called_at: dayjs().toISOString(),
            rent_villa_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-rent-villa.cm-trade-rent-villa')
            .findMany({
              filters: { rent_villa_uniq_code: payload.rent_villa_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-rent-villa.cm-trade-rent-villa')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-rent-villa.cm-trade-rent-villa')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ────────────────────────────────────────────
         2. 코드·연월 전체 페이지 동기화 (추가)
      ──────────────────────────────────────────── */
      async syncRentVillaByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[rent_villa] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncRentVilla(siguCd, dealYmd, page);
          if (rows < 1000) break;      // 마지막 페이지
        }
        strapi.log.info(
          `[rent_villa] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
        );
      },

      /* ────────────────────────────────────────────
         3. nextTarget 기반 배치 동기화(기존)
      ──────────────────────────────────────────── */
      async syncNextBatch() {
        const apiCalledSvc = strapi.service(
          'api::cm-trade-api-called.cm-trade-api-called',
        );
        const target = await apiCalledSvc.nextTargetOrCreate(tradeType);
        if (!target) {
          strapi.log.info('[rent_villa] 모든 대상 완료');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[rent_villa] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncRentVilla(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[rent_villa] ▶ 배치 완료 → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
