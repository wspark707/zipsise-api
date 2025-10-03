import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* ───────── 공통 상수 ───────── */
const API_KEY  = process.env.DATAGOKR_API_KEY;
const BASE_URL = 'http://apis.data.go.kr';

/* LH 임대주택 목록 */
const API_PATH  = '/B552555/lhLeaseInfo1/lhLeaseInfo1';
const PAGE_SIZE = 1000;

/* Strapi Store: 현재 페이지 기억 */
const getStore = (strapi: any) =>
  strapi.store({ type: 'plugin', name: 'lh-list', key: 'currentPage' });

export default factories.createCoreService(
  'api::cm-lh-list.cm-lh-list',
  ({ strapi }) => {
    /* ────────────────────────────────────────────
       내부 헬퍼 : 주어진 pageNo 동기화
    ──────────────────────────────────────────── */
    async function syncPage(pageNo: number): Promise<number> {
      strapi.log.info(`[lh_list] ▶ 호출 page=${pageNo}`);

      const { data } = await axios.get(API_PATH, {
        baseURL: BASE_URL,
        params: {
          PAGE: pageNo,
          PG_SZ: PAGE_SIZE,
          type: 'json',
          serviceKey: API_KEY,
        },
        timeout: 900_000,
      });

      const items: any[] = data?.['1']?.dsList ?? [];
      if (!items.length) {
        strapi.log.info(`[lh_list] page=${pageNo} 결과 없음`);
        return 0;
      }

      for (const v of items) {
        const payload: any = {
          lh_rnum: Number(v.RNUM),
          lh_area_name: v.ARA_NM,
          lh_tp_code_name: v.AIS_TP_CD_NM,
          lh_apt_name: v.SBD_LGO_NM,
          lh_total_household_count: Number(v.SUM_HSH_CNT ?? 0),
          lh_exclusive_area: Number(v.DDO_AR ?? 0),
          lh_household_count: Number(v.HSH_CNT ?? 0),

          /* BigInt → string */
          lh_deposit: String(v.LS_GMY ?? '0').replace(/,/g, ''),
          lh_monthly_rent: Number(v.RFE ?? 0),
          lh_first_movein_ym: v.MVIN_XPC_YM ?? null,

          lh_api_called_at: dayjs().toISOString(),
          lh_api_result: JSON.stringify(v),
        };

        const [existing] = await strapi
          .documents('api::cm-lh-list.cm-lh-list')
          .findMany({ filters: { lh_rnum: payload.lh_rnum }, limit: 1 });

        if (existing) {
          await strapi
            .documents('api::cm-lh-list.cm-lh-list')
            .update({ documentId: String(existing.documentId), data: payload });
        } else {
          await strapi
            .documents('api::cm-lh-list.cm-lh-list')
            .create({ data: payload });
        }
      }

      strapi.log.info(
        `[lh_list] page=${pageNo} ⇒ ${items.length} rows processed`,
      );
      return items.length;
    }

    return {
      /* ───────── 1. 다음 페이지 동기화 (Store 사용) ───────── */
      async syncNextPage(): Promise<number> {
        const store = getStore(strapi);
        const current = (await store.get()) ?? 0;
        const nextPage = Number(current) + 1;
        await store.set({ value: nextPage });

        const rows = await syncPage(nextPage);
        if (rows === 0) {
          await store.set({ value: 0 });          // 마지막 페이지 → 초기화
        }
        return rows;
      },

      /* ───────── 2. 지정 페이지 동기화 (신규) ───────── */
      async syncPage(pageNo: number): Promise<number> {
        return syncPage(pageNo);
      },
    };
  },
);
