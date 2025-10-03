/**
 * 서비스: cm-trade-sales-apt
 *  - 아파트 매매 실거래가 수집
 *  - Strapi v5  (JS/TS 겸용 예시)
 */

import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

interface AptItem { [k: string]: any }

const API_PATH =
  '/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade';

const safeDate = (val?: string) =>
  val && /^\d{8}$/.test(val) && dayjs(val, 'YYYYMMDD', true).isValid()
    ? dayjs(val, 'YYYYMMDD').format('YYYY-MM-DD')
    : null;

export default factories.createCoreService(
  'api::cm-trade-sales-apt.cm-trade-sales-apt',
  ({ strapi }) => {
    const tradeType = 'sales_apt' as const;

    return {
      /* ───────────────────────────────────────────────
         1. 한 페이지(최대 1,000건) 동기화
      ─────────────────────────────────────────────── */
      async syncSalesApt(
        siguCd: string,
        dealYmd: string,
        pageNo = 1,
        numOfRows = 1000,
      ): Promise<number> {
        strapi.log.info(
          `[sales_apt] 요청 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}`,
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

        const items: AptItem[] = data?.response?.body?.items?.item ?? [];
        strapi.log.info(
          `[sales_apt] 수신 → code=${siguCd}, ym=${dealYmd}, page=${pageNo}, rows=${items.length}`,
        );
        if (!items.length) return 0;

        for (const v of items) {
          const dealDate = v.dealYear
            ? dayjs(`${v.dealYear}-${v.dealMonth}-${v.dealDay}`, 'YYYY-M-D')
                .format('YYYY-MM-DD')
            : null;
          const dealAmt = Number(String(v.dealAmount).replace(/,/g, ''));

          const payload: any = {
            sales_apt_uniq_code: [
              v.sggCd, v.umdNm, v.aptNm, v.jibun, v.excluUseAr,
              dealDate ?? '', dealAmt, v.floor, v.rgstDate ?? '', v.cdealDay ?? '',
            ].join('-'),
            sales_apt_region_code: String(v.sggCd),
            sales_apt_umd_name: v.umdNm,
            sales_apt_name: v.aptNm,
            sales_apt_jibun: String(v.jibun),
            sales_apt_use_area: String(v.excluUseAr),
            sales_apt_deal_ymd: dealDate,
            sales_apt_deal_amount: dealAmt,
            sales_apt_floor: String(v.floor),
            sales_apt_build_year: String(v.buildYear),
            sales_apt_cdeal: v.cdealType === 'O' ? 1 : 0,
            sales_apt_cdeal_day: safeDate(v.cdealDay),
            sales_apt_deal_type: v.dealingGbn,
            sales_apt_estate_agency: v.estateAgentSggNm,
            sales_apt_regist_date: safeDate(v.rgstDate),
            sales_apt_dong: v.umdNm,
            sales_apt_seller: v.slerGbn ?? null,
            sales_apt_buyer: v.buyerGbn ?? null,
            sales_apt_landlease: v.landAr
              ? Number(String(v.landAr).replace(/,/g, ''))
              : 0,
            sales_apt_api_called_at: dayjs().toISOString(),
            sales_apt_api_result: JSON.stringify(v),
          };

          const [existing] = await strapi
            .documents('api::cm-trade-sales-apt.cm-trade-sales-apt')
            .findMany({
              filters: { sales_apt_uniq_code: payload.sales_apt_uniq_code },
              limit: 1,
            });

          existing
            ? await strapi
                .documents('api::cm-trade-sales-apt.cm-trade-sales-apt')
                .update({ documentId: existing.documentId, data: payload })
            : await strapi
                .documents('api::cm-trade-sales-apt.cm-trade-sales-apt')
                .create({ data: payload });
        }
        return items.length;
      },

      /* ───────────────────────────────────────────────
         2. (추가) 코드·연월 전체 페이지 동기화
      ─────────────────────────────────────────────── */
      async syncSalesAptByCodeYm(
        siguCd: string,
        dealYmd: string,
      ): Promise<void> {
        strapi.log.info(
          `[sales_apt] ▶ 전체 동기화 시작 → code=${siguCd}, ym=${dealYmd}`,
        );
        for (let page = 1; ; page++) {
          const rows = await this.syncSalesApt(siguCd, dealYmd, page);
          if (rows < 1000) break;
        }
        strapi.log.info(
          `[sales_apt] ▶ 전체 동기화 완료 → code=${siguCd}, ym=${dealYmd}`,
        );
      },

      /* ───────────────────────────────────────────────
         3. 기존 nextTarget 기반 배치 동기화
      ─────────────────────────────────────────────── */
      async syncNextBatch() {
        const apiCalledSvc = strapi.service(
          'api::cm-trade-api-called.cm-trade-api-called',
        );
        const target = await apiCalledSvc.nextTargetOrCreate(tradeType);
        if (!target) {
          strapi.log.info('[sales_apt] 처리할 pending 대상이 없습니다.');
          return;
        }

        const sigu = target.api_dg_code.slice(0, 5);
        const ym   = target.api_dg_ym.replace('-', '');

        strapi.log.info(
          `[sales_apt] ▶ 배치 대상 → code=${sigu}, ym=${ym}`,
        );

        for (let page = 1; ; page++) {
          const rows = await this.syncSalesApt(sigu, ym, page);
          if (rows < 1000) break;
        }

        await apiCalledSvc.markDone(target.documentId, tradeType);
        strapi.log.info(
          `[sales_apt] ▶ 배치 완료  → code=${sigu}, ym=${ym}`,
        );
      },
    };
  },
);
