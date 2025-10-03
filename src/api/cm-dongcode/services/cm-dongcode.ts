import axios from 'axios';
import { factories } from '@strapi/strapi';

interface StanRow {
  region_cd: string;
  sido_cd: string;
  sgg_cd: string;
  umd_cd: string;
  ri_cd: string;
  locatjumin_cd: string;
  locatjijuk_cd: string;
  locatadd_nm: string;
  locat_order: string;
  locat_rm: string;
  locathigh_cd: string;
  locallow_nm: string;
  adpt_de: string;
}

export default factories.createCoreService(
  'api::cm-dongcode.cm-dongcode',
  ({ strapi }) => ({
    async syncCmDongcode(pageNo = 1, lang = 'ko') {
      /* 1. 외부 API */
      const { data } = await axios.get(
        'http://apis.data.go.kr/1741000/StanReginCd/getStanReginCdList',
        {
          params: {
            serviceKey: process.env.DATAGOKR_API_KEY,
            pageNo,
            numOfRows: 1000,
            type: 'json',
          },
          timeout: 900_000,
        },
      );

      const rows: StanRow[] = data?.StanReginCd?.[1]?.row ?? [];

      /* 2. 업서트 */
      for (const r of rows) {
        const payload = {
          dong_region_cd:      r.region_cd,
          dong_sido_cd:        r.sido_cd,
          dong_sgg_cd:         r.sgg_cd,
          dong_umd_cd:         r.umd_cd,
          dong_ri_cd:          r.ri_cd,
          dong_locatjumin_cd:  r.locatjumin_cd,
          dong_locatjijuk_cd:  r.locatjijuk_cd,
          dong_locatadd_nm:    r.locatadd_nm,
          dong_locat_order:    r.locat_order,
          dong_locat_rm:       r.locat_rm,
          dong_locathigh_cd:   r.locathigh_cd,
          dong_locallow_nm:    r.locallow_nm,
          dong_adpt_de:        r.adpt_de,
        } as const;

        /* findMany + limit:1 ⇒ 타입 안전 */
        const [existing] = await strapi
          .documents('api::cm-dongcode.cm-dongcode')
          .findMany({
            filters: { dong_region_cd: payload.dong_region_cd },
            locale : lang,
            limit  : 1,
          });

        if (existing) {
          await strapi
            .documents('api::cm-dongcode.cm-dongcode')
            .update({
              documentId: existing.documentId, // ← 필수
              data      : payload,
              locale    : lang,
              status    : 'published',
            });
        } else {
          await strapi
            .documents('api::cm-dongcode.cm-dongcode')
            .create({
              data  : payload,
              locale: lang,
              status: 'published',
            });
        }
      }

      strapi.log.info(
        `[cm-dongcode] page ${pageNo} synced (${rows.length} rows)`,
      );
    },
  }),
);
