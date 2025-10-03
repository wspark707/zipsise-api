import axios from 'axios';
import { factories } from '@strapi/strapi';

/* ───────── 상수 ───────── */
const API_KEY  = process.env.SEOUL_OPEN_API_KEY ?? '776c63567277737034336a634b4e4a';
const API_BASE = `http://openapi.seoul.go.kr:8088/${API_KEY}/json`;
const API_NAME = 'OpenManagectSmMng';

const ROWS     = 100;      // page 크기
const MAX_PAGE = 10_000;   // 방어용 상한

/* 실제 응답 필드 기준 타입 */
type FeeRow = {
  APT_NM : string;          // 단지명
  APT_CD : string;          // 단지코드
  AMT_NM : string;          // 항목명(관리사무소 등)
  YM     : string;          // YYYYMM
  AMT    : string | number; // 금액
};

export default factories.createCoreService(
  'api::cm-seoul-apt-management-fee.cm-seoul-apt-management-fee',
  ({ strapi }) => {
    const ns = { type: 'plugin', name: 'cm-seoul-apt-management-fee' };

    /* ─── Store helpers ─── */
    const getNextPage = async (): Promise<number> =>
      ((await strapi.store(ns).get({ key: 'next-page' })) as number | null) ?? 1;

    const setNextPage = async (page: number | null) =>
      page
        ? strapi.store(ns).set({ key: 'next-page', value: page })
        : strapi.store(ns).delete({ key: 'next-page' });

    /* ─── 1 page 수집 ─── */
    async function syncPage(pageNo: number): Promise<number> {
      const start = (pageNo - 1) * ROWS + 1;
      const end   = pageNo * ROWS;

      strapi.log.info(`[amf] 요청 → page=${pageNo} (${start}~${end})`);

      const { data } = await axios.get(
        `${API_BASE}/${API_NAME}/${start}/${end}/`,
        { timeout: 900_000 },
      );

      const body  = data?.[API_NAME];
      const rows  = (body?.row as FeeRow[]) ?? [];
      const total = body?.list_total_count ?? 0;

      strapi.log.info(`[amf] 수신 → rows=${rows.length} / total=${total}`);
      if (!rows.length) return 0;

      /* upsert */
      for (const v of rows) {
        const payload = {
          amf_apt_code            : v.APT_CD,
          amf_apt_ym              : Number(v.YM) || 0,
          amf_apt_name            : v.APT_NM ?? null,
          amf_apt_management_name : v.AMT_NM ?? '',
          amf_apt_amount          : Number(String(v.AMT).replace(/,/g, '')) || 0,
        };

        const [exist] = await strapi
          .documents('api::cm-seoul-apt-management-fee.cm-seoul-apt-management-fee')
          .findMany({
            filters: {
              amf_apt_code           : payload.amf_apt_code,
              amf_apt_ym             : payload.amf_apt_ym,
              amf_apt_management_name: payload.amf_apt_management_name,
            },
            limit: 1,
          });

        exist
          ? await strapi
              .documents('api::cm-seoul-apt-management-fee.cm-seoul-apt-management-fee')
              .update({ documentId: String(exist.documentId), data: payload })
          : await strapi
              .documents('api::cm-seoul-apt-management-fee.cm-seoul-apt-management-fee')
              .create({ data: payload });
      }

      return rows.length;
    }

    /* ─── 서비스 메서드 ─── */
    return {
      /** 다음 page 1회 실행 (page 지정 시 강제) */
      async sync(pageNo?: number) {
        const page = pageNo ?? (await getNextPage());
        const rows = await syncPage(page);

        const next = rows < ROWS || page >= MAX_PAGE ? null : page + 1;
        await setNextPage(next);

        strapi.log.info(`[amf] page ${page} done, next = ${next ?? 'END'}`);
      },

      /** 크론·CLI용: 항상 “다음 page” */
      async syncNextBatch() {
        await this.sync();
      },
    };
  },
);
