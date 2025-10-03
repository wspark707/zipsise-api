/****************************************************************
 * cm-region-umd 서비스
 *  • 대상: cm_region_sgg 중 sgg_umd_api_called_at = null
 *  • 동기화: VWorld /ned/data/admDongList (page 1000 건씩)
 *  • 완료 후 cm_region_sgg 에 시각 기록
 ****************************************************************/
import axios from 'axios';

/* ───────── VWorld 공통 ───────── */
const VWORLD_KEY    = process.env.VWORLD_API_KEY  ?? 'CAE7D367-D0EA-3420-80FF-FED87037D8DC';
const VWORLD_DOMAIN = process.env.VWORLD_DOMAIN   ?? 'zipsise.com';
const BASE_URL      = 'https://api.vworld.kr';
const ROWS          = 1000;

const api = axios.create({ baseURL: BASE_URL, timeout: 15_000 });

export default ({ strapi }: { strapi: any }) => {
  /* ───── 헬퍼: 수집 대상 시·군·구 한 건 선택 ───── */
  const pickTargetSgg = async () =>
    (await (strapi.entityService as any).findMany(
      'api::cm-region-sgg.cm-region-sgg',
      {
        filters: { sgg_umd_api_called_at: null },
        sort   : { id: 'asc' },
        limit  : 1,
      },
    ))[0];

  /* ───── upsert to cm_region_umd ───── */
  const upsertUmd = async (
    umdCode: string,
    umdName: string,
    sggCode: string,
    sidoCode: string,
  ) => {
    const uid = 'api::cm-region-umd.cm-region-umd';
    const es  = strapi.entityService as any;
    const f   = await es.findMany(uid, { filters: { umd_code: umdCode }, limit: 1 });
    const data = { umd_code: umdCode, umd_name: umdName, sgg_code: sggCode, sido_code: sidoCode };
    return f.length ? es.update(uid, f[0].id, { data }) : es.create(uid, { data });
  };

  /* ───── 시·군·구 1건 → 모든 page 수집 ───── */
  const processSgg = async (sgg: { id: any; sgg_code: string; sido_code: string }) => {
    strapi.log.info(`[umd] ${sgg.sgg_code} ▶ start`);

    for (let page = 1; page < 1000; page++) {
      const { data } = await api.get('/ned/data/admDongList', {
        params: {
          key: VWORLD_KEY,
          format: 'json',
          domain: VWORLD_DOMAIN,
          admCode: sgg.sgg_code,
          numOfRows: ROWS,
          pageNo: page,
        },
      });

      const body = data?.admVOList;
      const rows = body?.admVOList ?? [];
      if (!rows.length) break;

      for (const v of rows)
        await upsertUmd(v.admCode, v.admCodeNm, sgg.sgg_code, sgg.sido_code);

      strapi.log.info(`[umd] ${sgg.sgg_code} page ${page} rows=${rows.length}`);

      if (body.totalCount <= page * ROWS) break;
    }

    /* 완료 표시 */
    await (strapi.entityService as any).update(
      'api::cm-region-sgg.cm-region-sgg',
      sgg.id,
      { data: { sgg_umd_api_called_at: new Date().toISOString() } },
    );

    strapi.log.info(`[umd] ${sgg.sgg_code} ▶ done`);
  };

  /* ───── 서비스 메서드 ───── */
  return {
    /** (A) 아직 미수집 시·군·구 1건 수집 */
    async syncNextBatch() {
      const target = await pickTargetSgg();
      if (!target) {
        strapi.log.info('[umd] no target sgg');
        return;
      }
      await processSgg(target);
    },

    /** (B) 특정 시·군·구 코드 강제 수집 */
    async sync(sggCode: string) {
      const [sgg] = await (strapi.entityService as any).findMany(
        'api::cm-region-sgg.cm-region-sgg',
        { filters: { sgg_code: sggCode }, limit: 1 },
      );
      if (!sgg) {
        strapi.log.error('[umd] specified sgg not found');
        return;
      }
      await processSgg(sgg);
    },
  };
};
