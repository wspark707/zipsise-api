import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Item { [k: string]: any }

/* 재건축·분양권(실거래 SILV) API */
const API_PATH =
  '/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade';

const safeDate = (v?: string) =>
  v && /^\d{8}$/.test(v) && dayjs(v, 'YYYYMMDD', true).isValid()
    ? dayjs(v, 'YYYYMMDD').format('YYYY-MM-DD')
    : null;

export default factories.createCoreService(
  'api::cm-trade-resale-apt.cm-trade-resale-apt',
  ({ strapi }) => {
    const tradeType = 'resale_apt' as const;

    return {
      /* ────────────────────────────────────────────
         1. 한 페이지 동기화
      ──────────────────────────────────────────── */
      async syncResaleApt(
        siguCd: string,    // 시군구 5자리
        dealYmd: string,   // YYYYMM
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[resale_apt] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
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

        const items: Item[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[resale_apt] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
        );
        if (!items.length) return 0;

        for (const v of items) {
          const dealDate = v.dealYear
            ? dayjs(`${v.dealYear}-${v.dealMonth}-${v.dealDay}`, 'YYYY-M-D')
                .format('YYYY-MM-DD')
            : null;
          const dealAmt = Number(String(v.dealAmount).replace(/,/g, ''));

          const payload: any = {
            resale_apt_uniq_code: [
              v.sggCd, v.umdNm, v.aptNm, v.jibun, v.excluUseAr,
              dealDate ?? '', dealAmt, v.floor,
              v.rgstDate ?? '', v.cdealDay ?? '',
            ].join('-'),

            resale_apt_region_code: String(v.sggCd),
            resale_apt_umd_name: v.umdNm,
            resale_apt_name: v.aptNm,
            resale_apt_jibun: String(v.jibun),
            resale_apt_use_area: String(v.excluUseAr),
            resale_apt_deal_ymd: dealDate,
            resale_apt_deal_amount: dealAmt,
            resale_apt_floor: String(v.floor),
            resale_apt_cdeal: v.cdealType === 'O' ? 1 : 0,
            resale_apt_cdeal_day: safeDate(v.cdealDay),
            resale_apt_deal_type: v.dealingGbn,
            resale_apt_estate_agency: v.estateAgentSggNm,
            resale_apt_seller: v.sellerGbn ?? null,
            resale_apt_buyer: v.buyerGbn ?? null,
            resale_apt_ownership: v.ownGbn ?? null,

            resale_apt_api_called_at: dayjs().toISOString(),
            resale_apt_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-resale-apt.cm-trade-resale-apt')
            .findMany({
              filters: { resale_apt_uniq_code: payload.resale_apt_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-resale-apt.cm-trade-resale-apt')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-resale-apt.cm-trade-resale-apt')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ────────────────────────────────────────────
         2. (추가) 코드·연월 전체 페이지 동기화
      ──────────────────────────────────────────── */
      async syncResaleAptByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[resale_apt] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncResaleApt(siguCd, dealYmd, page);
          if (rows < 1000) break;   // 마지막 페이지
        }
        strapi.log.info(
          `[resale_apt] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
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
          strapi.log.info('[resale_apt] 모든 대상 완료');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[resale_apt] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncResaleApt(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[resale_apt] ▶ 배치 완료 → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
