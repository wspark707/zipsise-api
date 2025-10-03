import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

interface RentItem { [k: string]: any }

/* 아파트 전·월세 실거래가 API */
const API_PATH =
  '/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent';

export default factories.createCoreService(
  'api::cm-trade-rent-apt.cm-trade-rent-apt',
  ({ strapi }) => {
    const tradeType = 'rent_apt' as const;

    return {
      /* ────────────────────────────────────────────
         1. 한 페이지(최대 1,000건) 동기화
      ──────────────────────────────────────────── */
      async syncRentApt(
        siguCd: string,    // 시군구 5자리
        dealYmd: string,   // YYYYMM
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[rent_apt] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
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

        const items: RentItem[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[rent_apt] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
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
            /* 유니크 키 */
            rent_apt_uniq_code: [
              v.sggCd, v.umdNm, v.aptNm, v.jibun, v.excluUseAr,
              contDate ?? '', deposit, rent, v.floor,
            ].join('-'),

            rent_apt_region_code: String(v.sggCd),
            rent_apt_umd_name: v.umdNm,
            rent_apt_name: v.aptNm,
            rent_apt_jibun: String(v.jibun),
            rent_apt_use_area: String(v.excluUseAr),
            rent_apt_deal_ymd: contDate,
            rent_apt_deposit: deposit,
            rent_apt_monthly_rent: rent,
            rent_apt_floor: String(v.floor ?? ''),
            rent_apt_build_year: String(v.buildYear ?? ''),
            rent_apt_contract_term: v.contTerm ?? null,
            rent_apt_contract_type: v.rentGbnNm ?? null,
            rent_apt_use_right: v.rightGbnNm ?? null,
            rent_apt_pre_deposit: v.prevDeposit ?? null,
            rent_apt_pre_monthly_rent: v.prevMonthlyRent ?? null,

            rent_apt_api_called_at: dayjs().toISOString(),
            rent_apt_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-rent-apt.cm-trade-rent-apt')
            .findMany({
              filters: { rent_apt_uniq_code: payload.rent_apt_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-rent-apt.cm-trade-rent-apt')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-rent-apt.cm-trade-rent-apt')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ────────────────────────────────────────────
         2. (추가) 코드·연월 전체 페이지 동기화
      ──────────────────────────────────────────── */
      async syncRentAptByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[rent_apt] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncRentApt(siguCd, dealYmd, page);
          if (rows < 1000) break;      // 마지막 페이지
        }
        strapi.log.info(
          `[rent_apt] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
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
          strapi.log.info('[rent_apt] 모든 대상 완료');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[rent_apt] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncRentApt(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[rent_apt] ▶ 배치 완료 → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
