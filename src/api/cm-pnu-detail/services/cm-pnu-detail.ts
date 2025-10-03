/****************************************************************
 * cm-pnu-detail 서비스
 * ──────────────────────────────────────────────────────────────
 *  • 호출당 PNU 1건을 VWorld 12개 엔드포인트로 수집
 *  • 결과를 9개(cm_ 프리픽스) 컬렉션에 upsert
 *  • plugin:cm-pnu-detail Store의 ‘next’ 인덱스로 순차 진행
 *  • generate-types 불필요: Strapi API 모두 as any 캐스팅
 ****************************************************************/
import axios from 'axios';

/* ───────── VWorld 공통 ───────── */
const VWORLD_KEY    = process.env.VWORLD_API_KEY  ?? 'CAE7D367-D0EA-3420-80FF-FED87037D8DC';
const VWORLD_DOMAIN = process.env.VWORLD_DOMAIN   ?? 'zipsise.com';
const BASE_URL      = 'https://api.vworld.kr';

const QS_BASE = {
  key   : VWORLD_KEY,
  format: 'json',
  domain: VWORLD_DOMAIN,
  numOfRows: 1000,
  pageNo  : 1,
};

const api = axios.create({ baseURL: BASE_URL, timeout: 15_000 });

type Row = Record<string, any>;
type MapFn = (v: Row) => Record<string, any>;

/* ───────── 12개 엔드포인트 & 매퍼 ───────── */
const EP: { path: string; root: string[]; coll: string; map: MapFn }[] = [
  /* 1) 건축물연령 */
  {
    path: '/ned/data/getBuildingAge',
    root: ['buildingAges', 'field'],
    coll: 'api::cm-pnu-building.cm-pnu-building',
    map : (v) => ({
      bld_gis_idntf_cno      : v.gisIdntfCno,
      bld_pnu                : v.pnu,
      bld_buld_name          : v.buldNm,
      bld_buld_age           : v.buldAge,
      bld_last_updt_dt       : v.lastUpdtDt || null,
    }),
  },
  /* 2) 건축물용도 */
  {
    path: '/ned/data/getBuildingUse',
    root: ['buildingUses', 'field'],
    coll: 'api::cm-pnu-building.cm-pnu-building',
    map : (v) => ({
      bld_gis_idntf_cno               : v.gisIdntfcNo,
      bld_buld_main_atach_se_code     : v.buldMainAtachSeCode,
      bld_buld_main_atach_se_code_name: v.buldMainAtachSeCodeNm,
      bld_detail_prpos_code           : v.detailPrposCode,
      bld_detail_prpos_code_name      : v.detailPrposCodeNm,
      bld_buld_prpos_cl_code          : v.buldPrposClCode,
      bld_buld_prpos_cl_code_name     : v.buldPrposClCodeNm,
    }),
  },
  /* 3) 토지특성 */
  {
    path: '/ned/data/getLandCharacteristics',
    root: ['landCharacteristicss', 'field'],
    coll: 'api::cm-pnu-land-characteristic.cm-pnu-land-characteristic',
    map : (v) => ({
      plc_pnu          : v.pnu,
      plc_stdr_year    : v.stdrYear,
      plc_stdr_mt      : v.stdrMt,
      plc_lndpcl_ar    : Number(v.lndpclAr ?? 0),
      plc_pblntf_pclnd : BigInt(v.pblntfPclnd ?? 0),
      plc_last_updt_dt : v.lastUpdtDt || null,
    }),
  },
  /* 4) 개별공시지가 */
  {
    path: '/ned/data/getIndvdLandPriceAttr',
    root: ['indvdLandPrices', 'field'],
    coll: 'api::cm-pnu-individual-land-price.cm-pnu-individual-land-price',
    map : (v) => ({
      ilp_pnu          : v.pnu,
      ilp_stdr_year    : v.stdrYear,
      ilp_stdr_mt      : v.stdrMt.toString().padStart(2, '0'),
      ilp_pblntf_pclnd : BigInt(v.pblntfPclnd ?? 0),
      ilp_last_updt_dt : v.lastUpdtDt || null,
    }),
  },
  /* 5) 개별주택가격 */
  {
    path: '/ned/data/getIndvdHousingPriceAttr',
    root: ['indvdHousingPrices', 'field'],
    coll: 'api::cm-pnu-individual-house-price.cm-pnu-individual-house-price',
    map : (v) => ({
      ihp_pnu                   : v.pnu,
      ihp_bild_regstr_esntl_no  : v.bildRegstrEsntlNo,
      ihp_stdr_year             : v.stdrYear,
      ihp_stdr_mt               : v.stdrMt,
      ihp_house_pc              : v.housePc,
      ihp_last_updt_dt          : v.lastUpdtDt || null,
    }),
  },
  /* 6) 공동주택가격 */
  {
    path: '/ned/data/getApartHousingPriceAttr',
    root: ['apartHousingPrices', 'field'],
    coll: 'api::cm-pnu-apart-house-price.cm-pnu-apart-house-price',
    map : (v) => ({
      ahp_pnu          : v.pnu,
      ahp_stdr_year    : v.stdrYear,
      ahp_stdr_mt      : v.stdrMt,
      ahp_dong_name    : v.dongNm,
      ahp_floor_name   : v.floorNm,
      ahp_ho_name      : v.hoNm,
      ahp_pblntf_pc    : BigInt(v.pblntfPc ?? 0),
      ahp_last_updt_dt : v.lastUpdtDt || null,
    }),
  },
  /* 7) 토지소유 */
  {
    path: '/ned/data/getPossessionAttr',
    root: ['possessions', 'field'],
    coll: 'api::cm-pnu-land-posession.cm-pnu-land-posession',
    map : (v) => ({
      pss_pnu            : v.pnu,
      pss_buld_dong_name : v.buldDongNm,
      pss_buld_floor_name: v.buldFloorNm,
      pss_buld_ho_name   : v.buldHoNm,
      pss_cnrs_psn_sn    : v.cnrsPsnSn,
      pss_stdr_ym        : v.stdrYm,
      pss_cnrs_psn_co    : Number(v.cnrsPsnCo ?? 0),
      pss_last_updt_dt   : v.lastUpdtDt || null,
    }),
  },
  /* 8) 토지이동 */
  {
    path: '/ned/data/getLandMoveAttr',
    root: ['landMoves', 'field'],
    coll: 'api::cm-pnu-land-move.cm-pnu-land-move',
    map : (v) => ({
      lmv_pnu            : v.pnu,
      lmv_lad_mvmn_hist_sn: v.ladMvmnHistSn,
      lmv_lad_hist_sn    : v.ladHistSn,
      lmv_last_updt_dt   : v.lastUpdtDt || null,
    }),
  },
  /* 9) 토지이용계획 */
  {
    path: '/ned/data/getLandUseAttr',
    root: ['landUses', 'field'],
    coll: 'api::cm-pnu-land-use.cm-pnu-land-use',
    map : (v) => ({
      lus_pnu         : v.pnu,
      lus_manage_no   : v.manageNo,
      lus_cnflc_at    : v.cnflcAt,
      lus_last_updt_dt: v.lastUpdtDt || null,
    }),
  },
  /* 10) 건물일련번호 */
  {
    path: '/ned/data/buldSnList',
    root: ['ldaregVOList', 'ldaregVOList'],
    coll: 'api::cm-pnu-building-sn.cm-pnu-building-sn',
    map : (v) => ({
      bsn_pnu            : v.pnu,
      bsn_agbldg_sn      : v.agbldgSn,
      bsn_buld_dong_name : v.buldDongNm,
      bsn_buld_floor_name: v.buldFloorNm,
      bsn_buld_ho_name   : v.buldHoNm,
      bsn_last_updt_dt   : v.lastUpdtDt || null,
    }),
  },
  /* 11) 토지등급 */
  {
    path: '/ned/data/ladgrdList',
    root: ['ladgrdVOList', 'ladgrdVOList'],
    coll: 'api::cm-pnu-land-grade.cm-pnu-land-grade',
    map : (v) => ({
      lgr_pnu             : v.pnu,
      lgr_regstr_se_code  : v.regstrSeCode,
      lgr_lad_grad_se_code: v.ladGradSeCode,
      lgr_lad_grad_change_de: v.ladGradChangeDe,
      lgr_last_updt_dt    : v.lastUpdtDt || null,
    }),
  },
  /* 12) 토지임야목록 */
  {
    path: '/ned/data/ladfrlList',
    root: ['ladfrlVOList', 'ladfrlVOList'],
    coll: 'api::cm-pnu-land-forest.cm-pnu-land-forest',
    map : (v) => ({
      lfr_pnu          : v.pnu,
      lfr_lad_frtl_sc  : v.ladFrtlSc,
      lfr_cnrs_psn_co  : Number(v.cnrsPsnCo ?? 0),
      lfr_last_updt_dt : v.lastUpdtDt || null,
    }),
  },
];

/* ──────────────────────────────────────────── */
export default ({ strapi }: { strapi: any }) => {
  /* Store (plugin:cm-pnu-detail) */
  const store = strapi.store({ type: 'plugin', name: 'cm-pnu-detail' });
  const getIdx = async () => (await store.get({ key: 'next' })) ?? 0;
  const setIdx = async (i: number) => store.set({ key: 'next', value: i });

  /* Upsert helper */
  const upsert = async (uid: string, where: Record<string, any>, data: any) => {
    const es = strapi.entityService as any;
    const f  = await es.findMany(uid, { filters: where, limit: 1 });
    return f.length ? es.update(uid, f[0].id, { data }) : es.create(uid, { data });
  };

  /* 엔드포인트 호출 */
  const runEndpoint = async (pnu: string, ep: typeof EP[number]) => {
    const { data } = await api.get(ep.path, { params: { ...QS_BASE, pnu } });
    const rows = ep.root.reduce((o: any, k) => o?.[k], data) ?? [];
    if (!Array.isArray(rows) || !rows.length) return;

    strapi.log.info(`[PNU] ${pnu} → ${ep.path} rows=${rows.length}`);

    for (const r of rows) {
      const payload = ep.map(r);
      const key = Object.keys(payload)[0];         // 첫 필드로 중복조건
      await upsert(ep.coll, { [key]: payload[key] }, payload);
    }
  };

  /* PNU 전체 처리 */
  const processPnu = async (pnu: string) => {
    strapi.log.info(`[PNU] ${pnu} ▶ start`);
    for (const ep of EP) await runEndpoint(pnu, ep);
    strapi.log.info(`[PNU] ${pnu} ▶ done`);
  };

  /* PNU 목록 */
  const getList = async () =>
    (await (strapi.entityService as any).findMany(
      'api::cm-pnu-list.cm-pnu-list',
      { sort: { id: 'asc' }, limit: 10000 },
    )) as any[];

  /* 메인 sync */
  const sync = async (pnuId?: string) => {
    const list = await getList();
    if (!list.length) return;

    let idx = await getIdx();
    if (pnuId) {
      const i = list.findIndex((x) => x.pnu_id === pnuId);
      if (i < 0) { strapi.log.error('[PNU] not found'); return; }
      idx = i;
    }

    await processPnu(list[idx].pnu_id);
    await setIdx((idx + 1) % list.length);
  };

  /* 서비스 API */
  return {
    /** PNU 지정 / 순차 수집 */
    async sync(pnu?: string) { await sync(pnu); },
    /** 크론·CLI: 다음 PNU 한 건 */
    async syncNextBatch() { await sync(); },
  };
};
