/****************************************************************
 * cm-pnu-land-standard-price 서비스 (페이지 포인터 = Store)
 ****************************************************************/
import axios from 'axios';

/* VWorld 공통 */
const KEY    = process.env.VWORLD_API_KEY  ?? 'CAE7D367-D0EA-3420-80FF-FED87037D8DC';
const DOMAIN = process.env.VWORLD_DOMAIN   ?? 'zipsise.com';
const BASE   = 'https://api.vworld.kr';
const ROWS   = 1000;

const api = axios.create({ baseURL: BASE, timeout: 15_000 });

export default ({ strapi }: { strapi: any }) => {
  const store = strapi.store({ type: 'plugin', name: 'cm-pnu-land-standard-price' });
  const SIDO_UID = 'api::cm-region-sido.cm-region-sido';
  const LSP_UID  = 'api::cm-pnu-land-standard-price.cm-pnu-land-standard-price';
  const PNU_UID  = 'api::cm-pnu-list.cm-pnu-list';
  const es       = strapi.entityService as any;

  /* ───── Store helpers ───── */
  const keyOf = (sidoCode: string) => `lsp_page_${sidoCode}`;
  const getPage = async (sidoCode: string) =>
    (await store.get({ key: keyOf(sidoCode) })) ?? 1;
  const setPage = async (sidoCode: string, page?: number) =>
    page ? store.set({ key: keyOf(sidoCode), value: page }) : store.delete({ key: keyOf(sidoCode) });

  /* ───── 미완료 시·도 1건 가져오기 ───── */
  /* 대상 시·도 한 건 선택 */
const pickSido = async () =>
  // ① done_at == null 우선
  // ② 모두 완료라면 done_at ASC(가장 과거) 우선
  (await es.findMany(
    SIDO_UID,
    {
      sort: {                            // 순서가 핵심!
        sido_lsp_done_at: 'asc',         // null 이 맨 앞, 그다음 과거 → 최신
        id: 'asc',
      },
      limit: 1,
    },
  ))[0];


  /* ───── upsert helpers ───── */
  const upsertLsp = async (payload: any) => {
    const where = { lsp_pnu: payload.lsp_pnu, lsp_stdr_year: payload.lsp_stdr_year };
    const f = await es.findMany(LSP_UID, { filters: where, limit: 1 });
    return f.length
      ? es.update(LSP_UID, f[0].id, { data: payload })
      : es.create(LSP_UID, { data: payload });
  };
  const upsertPnu = async (pnu: string) => {
    const f = await es.findMany(PNU_UID, { filters: { pnu_id: pnu }, limit: 1 });
    if (!f.length) await es.create(PNU_UID, { data: { pnu_id: pnu } });
  };

  /* ───── 시·도 + page 1회 수집 ───── */
  const runPage = async (sido: any) => {
    const page = await getPage(sido.sido_code);

    const { data } = await api.get('/ned/data/getReferLandPriceAttr', {
      params: {
        key: KEY, format: 'json', domain: DOMAIN,
        ldCode: sido.sido_code, numOfRows: ROWS, pageNo: page,
      },
    });

    const rows = data?.referLandPrices?.field ?? [];
    if (!rows.length) {
      /* 마지막 페이지 → 완료 처리 */
      await es.update(SIDO_UID, sido.id, {
        data: { sido_lsp_done_at: new Date().toISOString() },
      });
      await setPage(sido.sido_code);           // 키 삭제
      strapi.log.info(`[lsp] ${sido.sido_code} 완료`);
      return;
    }

    for (const v of rows) {
      const payload = {
        lsp_pnu          : v.pnu,
        lsp_stdr_year    : v.stdrYear,
        lsp_std_land_sn  : v.stdLandSn,
        lsp_lndcgr_code  : v.lndcgrCode,
        lsp_lndcgr_code_name: v.lndcgrCodeNm,
        lsp_lndpcl_ar    : v.lndpclAr,
        lsp_pblntf_pclnd : v.pblntfPclnd,
        lsp_last_updt_dt : v.lastUpdtDt || null,
        lsp_api_called_at: new Date().toISOString(),
        lsp_api_result   : JSON.stringify(v),
      };

      await upsertLsp(payload);
      await upsertPnu(v.pnu);
    }

    strapi.log.info(`[lsp] ${sido.sido_code} page ${page} rows=${rows.length}`);
    await setPage(sido.sido_code, page + 1);   // 다음 page 저장
  };

  /* ───── 서비스 메서드 ───── */
  return {
    /** 순차 실행: “미완료 시·도” 1건의 page 1회 */
    async syncNextBatch() {
      const target = await pickSido();
      if (!target) { strapi.log.info('[lsp] 대상 시·도 없음'); return; }
      await runPage(target);
    },

    /** 특정 시·도(+옵션 page) 강제 */
    async sync(sidoCode: string, page?: number) {
      const [sido] = await es.findMany(
        SIDO_UID,
        { filters: { sido_code: sidoCode }, limit: 1 },
      );
      if (!sido) { strapi.log.error('[lsp] 시·도 찾을 수 없음'); return; }
      if (page) await setPage(sidoCode, page);
      await runPage(sido);
    },
  };
};
