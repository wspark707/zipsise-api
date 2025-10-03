import axios from 'axios';

/* VWorld 공통 */
const VWORLD_KEY    = process.env.VWORLD_API_KEY  ?? 'CAE7D367-D0EA-3420-80FF-FED87037D8DC';
const VWORLD_DOMAIN = process.env.VWORLD_DOMAIN   ?? 'zipsise.com';
const BASE          = 'https://api.vworld.kr';
const ROWS          = 1000;

const api = axios.create({ baseURL: BASE, timeout: 15_000 });

export default ({ strapi }: { strapi: any }) => {
  const store = strapi.store({ type: 'plugin', name: 'cm-region-sido' });
  const nextPage = async () => (await store.get({ key: 'next-page' })) ?? 1;
  const setNext  = async (p?: number) =>
    p ? store.set({ key: 'next-page', value: p }) : store.delete({ key: 'next-page' });

  const upsert = async (code: string, name: string) => {
    const uid = 'api::cm-region-sido.cm-region-sido';
    const es  = strapi.entityService as any;
    const f   = await es.findMany(uid, { filters: { sido_code: code }, limit: 1 });
    const data = { sido_code: code, sido_name: name };
    return f.length ? es.update(uid, f[0].id, { data }) : es.create(uid, { data });
  };

  const fetchPage = async (page: number) => {
    const { data } = await api.get('/ned/data/admCodeList', {
      params: { key: VWORLD_KEY, format: 'json', domain: VWORLD_DOMAIN, numOfRows: ROWS, pageNo: page },
    });

    const body = data?.admVOList;
    const rows = body?.admVOList ?? [];
    const total= body?.totalCount ?? 0;
    if (!rows.length) return { rows: 0, total };

    for (const v of rows) await upsert(v.admCode, v.admCodeNm);
    strapi.log.info(`[sido] page ${page} rows=${rows.length}/${total}`);
    return { rows: rows.length, total };
  };

  const sync = async (page?: number) => {
    const p = page ?? (await nextPage());
    const { rows } = await fetchPage(p);
    const next = rows < ROWS ? undefined : p + 1;
    await setNext(next);
  };

  return {
    async sync(page?: number) { await sync(page); },
    async syncNextBatch() { await sync(); },
  };
};
