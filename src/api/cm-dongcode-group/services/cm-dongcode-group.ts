/* /var/www/jipgap_backend/src/api/cm-dongcode-group/services/cm-dongcode-group.ts */

import { factories } from '@strapi/strapi';

export default factories.createCoreService(
  'api::cm-dongcode-group.cm-dongcode-group',   // ← UID 그대로
  ({ strapi }) => ({
    /**
     * cm_dongcodes → cm_dongcode_groups 집계
     * - dong_region_cd 앞 5자리(dg_code)만 저장
     * - 이미 존재하면 건너뜀
     */
    async syncFromDongcodes() {
      // 1) 모든 dong_region_cd 읽기
      const dongDocs = await strapi
        .documents('api::cm-dongcode.cm-dongcode')
        .findMany({ fields: ['dong_region_cd'], limit: -1 });

      // 2) 5자리 코드 집합
      const codes = new Set(
        dongDocs
          .map((d: any) => d.dong_region_cd?.slice(0, 5))
          .filter(Boolean),
      );

      // 3) 코드별 업서트
      for (const code of codes) {
        const [existing] = await strapi
          .documents('api::cm-dongcode-group.cm-dongcode-group')
          .findMany({ filters: { dg_code: code }, limit: 1 });

        if (!existing) {
          await strapi
            .documents('api::cm-dongcode-group.cm-dongcode-group')
            .create({ data: { dg_code: code } });
          // api_rental_house_called_at 은 훗날 별도 업데이트
        }
      }

      strapi.log.info(
        `[cm-dongcode-group] synced ${codes.size} unique dg_code`,
      );
    },
  }),
);
