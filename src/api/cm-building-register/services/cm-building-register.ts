import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* ───────── 상수 ───────── */
const API_BASE = 'https://apis.data.go.kr';
const API_KEY  = process.env.DATAGOKR_API_KEY!;
const ROWS     = 100;     // 한 페이지 행 수
const MAX_PAGE = 1000;    // 방어용 최대 페이지

/** 건축물대장 9종 API 엔드포인트 */
const ENDPT: Record<number, string> = {
  1: '/1613000/BldRgstHubService/getBrBasisOulnInfo',
  2: '/1613000/BldRgstHubService/getBrRecapTitleInfo',
  3: '/1613000/BldRgstHubService/getBrTitleInfo',
  4: '/1613000/BldRgstHubService/getBrFlrOulnInfo',
  5: '/1613000/BldRgstHubService/getBrAtchJibunInfo',
  6: '/1613000/BldRgstHubService/getBrExposPubuseAreaInfo',
  7: '/1613000/BldRgstHubService/getBrWclfInfo',
  8: '/1613000/BldRgstHubService/getBrHsprcInfo',
  9: '/1613000/BldRgstHubService/getBrJijiguInfo',
};

/** 숫자 변환기(쉼표 제거) */
const N = (v: any) => Number(String(v ?? 0).replace(/,/g, '') || 0);

/** 타입별 핵심 필드 매핑 (register_id 제외) */
const MAP: Record<number, (v: any) => Record<string, any>> = {
  1: (v) => ({ reg_building_name: v.bldNm }),
  2: (v) => ({ reg_main_building_cnt: N(v.mainBldCnt) }),
  3: (v) => ({ reg_roof_code_name: v.roofCdNm }),
  4: (v) => ({ reg_area_except: v.areaExctYn }),
  5: (v) => ({ reg_attached_register_code_name: v.atchRegstrGbCdNm }),
  6: (v) => ({ reg_floor_code_name: v.flrGbCdNm }),
  7: (v) => ({ reg_mode_code_name: v.modeCdNm }),
  8: (v) => ({ reg_house_price: N(v.hsprc) }),
  9: (v) => ({ reg_jijigu_gb_code_name: v.jijiguGbCdNm }),
};

export default factories.createCoreService(
  'api::cm-building-register.cm-building-register',
  ({ strapi }) => {
    /* ───────── Store 헬퍼 ───────── */
    const ns = { type: 'plugin', name: 'cm-building-register' };

    /** 다음 호출할 page 번호 (없으면 1) */
    async function getNextPage(dongId: string | number): Promise<number> {
      const v = (await strapi
        .store(ns)
        .get({ key: `next-page:${dongId}` })) as number | null;
      return v ?? 1;
    }

    /** 다음 page 저장 (끝났으면 null 로 삭제) */
    async function setNextPage(
      dongId: string | number,
      page: number | null,
    ) {
      const key = `next-page:${dongId}`;
      page
        ? await strapi.store(ns).set({ key, value: page })
        : await strapi.store(ns).delete({ key });
    }

    /* ───────── 1. 한 동·한 페이지 수집 ───────── */
    async function collectByPage(dg: any, pageNo: number) {
      const sigunguCd = dg.dong_sido_cd + dg.dong_sgg_cd;
      const bjdongCd  = dg.dong_umd_cd  + dg.dong_ri_cd;

      const bucket: Record<string, any> = {};

      for (const type of Object.keys(ENDPT).map(Number)) {
        strapi.log.info(
          `[bld_reg] dong=${dg.id} type=${type} page=${pageNo}`,
        );

        const { data } = await axios.get(API_BASE + ENDPT[type], {
          params: {
            serviceKey: API_KEY,
            sigunguCd,
            bjdongCd,
            pageNo,
            numOfRows: ROWS,
            _type: 'json',
          },
          timeout: 900_000,
        });

        const items: any[] = data?.response?.body?.items?.item ?? [];
        if (!items.length) continue;             // 이 타입은 데이터 없음

        for (const raw of items) {
          const rid = String(raw.mgmBldrgstPk);       // PK
          const jsonKey = `type${type}_json` as const;

          if (!bucket[rid]) {
            bucket[rid] = {
              register_id: rid,
              reg_building_name: raw.bldNm ?? null,
              reg_sigungu_code: sigunguCd,
              reg_bjdong_code: bjdongCd,
            };
          }
          bucket[rid][jsonKey] = raw;
          Object.assign(bucket[rid], MAP[type](raw));
        }
      }

      /* ─── upsert ─── */
      for (const doc of Object.values(bucket)) {
        const [exist] = await strapi
          .documents('api::cm-building-register.cm-building-register')
          .findMany({
            filters: { register_id: doc.register_id },
            limit: 1,
          });

        exist
          ? await strapi
              .documents('api::cm-building-register.cm-building-register')
              .update({
                documentId: String(exist.documentId),
                data: doc,
              })
          : await strapi
              .documents('api::cm-building-register.cm-building-register')
              .create({ data: doc });
      }

      return Object.keys(bucket).length;       // 저장 건수
    }

    /* ───────── 2. 서비스 메서드 ───────── */
    return {
      /** (A) 특정 동 · 페이지 (pageNo 없으면 Store 값) */
      async syncRegisterByDong(
        dongId: string | number,
        pageNo?: number,
      ) {
        const [dg] = await strapi
          .documents('api::cm-dongcode.cm-dongcode')
          .findMany({ filters: { id: dongId }, limit: 1 });

        if (!dg) {
          strapi.log.error('[bld_reg] dong not found');
          return;
        }

        const page = pageNo ?? (await getNextPage(dg.id));
        const rows = await collectByPage(dg, page);

        /* Store 에 다음 page 저장/삭제 */
        const next =
          rows < ROWS || page >= MAX_PAGE ? null : page + 1;
        await setNextPage(dg.id, next);

        /* 호출 시각만 dongcode 에 기록 (옵션) */
	if (next === null) {
          await strapi
            .documents('api::cm-dongcode.cm-dongcode')
            .update({
              documentId: String(dg.documentId),
              data: {
                dong_building_register_api_called_at: dayjs().toISOString(),
              },
            });
	 }
      },

      /** (B) 가장 오래된 동에 대해 '다음 page' 한 번 수행 */
      async syncNextBatch() {
        const [dg] = await strapi
          .documents('api::cm-dongcode.cm-dongcode')
          .findMany({
            sort: { dong_building_register_api_called_at: 'asc' },
            limit: 1,
          });

        if (!dg) {
          strapi.log.info('[bld_reg] no target');
          return;
        }

        const page = await getNextPage(dg.id);
        await this.syncRegisterByDong(dg.id, page);
      },
    };
  },
);
