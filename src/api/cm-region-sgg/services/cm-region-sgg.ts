import axios from 'axios';

/* VWorld 공통 */
const VWORLD_KEY    = process.env.VWORLD_API_KEY  ?? 'CAE7D367-D0EA-3420-80FF-FED87037D8DC';
const VWORLD_DOMAIN = process.env.VWORLD_DOMAIN   ?? 'zipsise.com';
const BASE          = 'https://api.vworld.kr';
const ROWS          = 1000;

const api = axios.create({ baseURL: BASE, timeout: 15_000 });

export default ({ strapi }: { strapi: any }) => {
  /* 1. 아직 시·군·구 API 미호출인 시·도 1건 선택 */
  const pickTargetSido = async () =>
    (await (strapi.entityService as any).findMany(
      'api::cm-region-sido.cm-region-sido',
      {
        filters: { sido_sgg_api_called_at: null },
        sort   : { id: 'asc' },
        limit  : 1,
      },
    ))[0];

  /* 2. 시·군·구 컬렉션 upsert */
  const upsertSgg = async (code: string, name: string, sido: string) => {
    const uid = 'api::cm-region-sgg.cm-region-sgg';
    const es  = strapi.entityService as any;
    const f   = await es.findMany(uid, { filters: { sgg_code: code }, limit: 1 });
    const data= { sgg_code: code, sgg_name: name, sido_code: sido };
    return f.length ? es.update(uid, f[0].id, { data }) : es.create(uid, { data });
  };

  /* 3. 특정 시·도 → 모든 page 수집 */
  const processSido = async (sido: { id: any; sido_code: string }) => {
    strapi.log.info(`[sgg] ${sido.sido_code} ▶ start`);

    for (let page = 1; page < 1000; page++) {
      const { data } = await api.get('/ned/data/admSiList', {
        params: {
          key: VWORLD_KEY, format: 'json', domain: VWORLD_DOMAIN,
          admCode: sido.sido_code, numOfRows: ROWS, pageNo: page,
        },
      });

      const body = data?.admVOList;
      const rows = body?.admVOList ?? [];
      if (!rows.length) break;

      for (const v of rows) await upsertSgg(v.admCode, v.admCodeNm, sido.sido_code);
      strapi.log.info(`[sgg] ${sido.sido_code} page ${page} rows=${rows.length}`);

      if (body.totalCount <= page * ROWS) break;
    }

    /* 4. 완료 타임스탬프 저장 */
    await (strapi.entityService as any).update(
      'api::cm-region-sido.cm-region-sido',
      sido.id,
      { data: { sido_sgg_api_called_at: new Date().toISOString() } },
    );

    strapi.log.info(`[sgg] ${sido.sido_code} ▶ done`);
  };

  /* 공개 메서드 */
  return {
    /** 아직 수집 안된 시·도 1건 처리 */
    async syncNextBatch() {
      const target = await pickTargetSido();
      if (!target) { strapi.log.info('[sgg] no target sido'); return; }
      await processSido(target);
    },

    /** 특정 시·도 코드 강제 처리 */
    async sync(sidoCode: string) {
      const [sido] = await (strapi.entityService as any).findMany(
        'api::cm-region-sido.cm-region-sido',
        { filters: { sido_code: sidoCode }, limit: 1 },
      );
      if (!sido) { strapi.log.error('[sgg] sido not found'); return; }
      await processSido(sido);
    },
  };
};
