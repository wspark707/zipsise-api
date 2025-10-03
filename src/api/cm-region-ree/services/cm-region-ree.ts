/****************************************************************
 * cm-region-ree 서비스
 *  • 대상: cm_region_umd 중 umd_ree_api_called_at = null
 *  • 동기화: VWorld /ned/data/admReeList (page 1,000건씩)
 *  • 완료 후 cm_region_umd 의 umd_ree_api_called_at 업데이트
 *  • generate-types 불필요 (모든 Strapi 호출 as any 캐스팅)
 ****************************************************************/
import axios from 'axios';

/* ───────── VWorld 공통 ───────── */
const KEY    = process.env.VWORLD_API_KEY  ?? 'CAE7D367-D0EA-3420-80FF-FED87037D8DC';
const DOMAIN = process.env.VWORLD_DOMAIN   ?? 'zipsise.com';
const BASE   = 'https://api.vworld.kr';
const ROWS   = 1000;

const api = axios.create({ baseURL: BASE, timeout: 15_000 });

export default ({ strapi }: { strapi: any }) => {
  /* ───── 아직 리 미수집인 읍·면·동 1건 선택 ───── */
  const pickTargetUmd = async () =>
    (await (strapi.entityService as any).findMany(
      'api::cm-region-umd.cm-region-umd',
      {
        filters: { umd_ree_api_called_at: null },
        sort   : { id: 'asc' },
        limit  : 1,
      },
    ))[0];

  /* ───── cm_region_ree upsert ───── */
  const upsertRee = async (
    reeCode: string,
    reeName: string,
    umdCode: string,
    sggCode: string,
    sidoCode: string,
  ) => {
    const uid = 'api::cm-region-ree.cm-region-ree';
    const es  = strapi.entityService as any;
    const f   = await es.findMany(uid, { filters: { ree_code: reeCode }, limit: 1 });
    const data = { ree_code: reeCode, ree_name: reeName, umd_code: umdCode, sgg_code: sggCode, sido_code: sidoCode };
    return f.length ? es.update(uid, f[0].id, { data }) : es.create(uid, { data });
  };

  /* ───── 읍·면·동 1건 → 모든 page 수집 ───── */
  const processUmd = async (umd: { id: any; umd_code: string; sgg_code: string; sido_code: string }) => {
    strapi.log.info(`[ree] ${umd.umd_code} ▶ start`);

    for (let page = 1; page < 1000; page++) {
      const { data } = await api.get('/ned/data/admReeList', {
        params: {
          key: KEY,
          format: 'json',
          domain: DOMAIN,
          admCode: umd.umd_code,
          numOfRows: ROWS,
          pageNo: page,
        },
      });

      const body = data?.admVOList;
      const rows = body?.admVOList ?? [];
      if (!rows.length) break;

      for (const v of rows)
        await upsertRee(v.admCode, v.admCodeNm, umd.umd_code, umd.sgg_code, umd.sido_code);

      strapi.log.info(`[ree] ${umd.umd_code} page ${page} rows=${rows.length}`);
      if (body.totalCount <= page * ROWS) break;
    }

    /* 완료 표식 */
    await (strapi.entityService as any).update(
      'api::cm-region-umd.cm-region-umd',
      umd.id,
      { data: { umd_ree_api_called_at: new Date().toISOString() } },
    );

    strapi.log.info(`[ree] ${umd.umd_code} ▶ done`);
  };

  /* ───── 서비스 API ───── */
  return {
    /** 다음 대상(umd) 한 건 수집 */
    async syncNextBatch() {
      const target = await pickTargetUmd();
      if (!target) { strapi.log.info('[ree] no target umd'); return; }
      await processUmd(target);
    },

    /** 특정 읍·면·동 코드 강제 수집 */
    async sync(umdCode: string) {
      const [umd] = await (strapi.entityService as any).findMany(
        'api::cm-region-umd.cm-region-umd',
        { filters: { umd_code: umdCode }, limit: 1 },
      );
      if (!umd) { strapi.log.error('[ree] specified umd not found'); return; }
      await processUmd(umd);
    },
  };
};
