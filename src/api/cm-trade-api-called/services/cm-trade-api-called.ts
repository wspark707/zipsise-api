import { factories } from '@strapi/strapi';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
dayjs.extend(isSameOrBefore);

type TradeType =
  | 'sales_apt'
  | 'resale_apt'
  | 'sales_villa'
  | 'rent_apt'
  // 필요 시 계속 추가 …

export default factories.createCoreService(
  'api::cm-trade-api-called.cm-trade-api-called',
  ({ strapi }) => ({

    /** 공통 타깃 선택 + (필요 시) 새 행 create */
    async nextTargetOrCreate(tradeType: TradeType) {
      const col = `api_${tradeType}_called_at` as const;

      /* 1) 동코드 그룹 */
      const groups = await strapi
        .documents('api::cm-dongcode-group.cm-dongcode-group')
        .findMany({ fields: ['dg_code'], limit: -1 });

      /* 2) 2006-01 ~ 현재 월 */
      const ymList: string[] = [];
      for (
        let d = dayjs('2006-01-01');
        d.isSameOrBefore(dayjs(), 'month');
        d = d.add(1, 'month')
      ) ymList.push(d.format('YYYY-MM'));

      for (const { dg_code } of groups as { dg_code: string }[]) {
        for (const ym of ymList) {
          try {
            /* 새 row create 시도 */
            const row = await strapi
              .documents('api::cm-trade-api-called.cm-trade-api-called')
              .create({ data: { api_dg_code: dg_code, api_dg_ym: ym } });
            return row as any;
          } catch (e: any) {
            const dup =
              e.code === 'ER_DUP_ENTRY' ||
              e.sqlState === '23000' ||
              /duplicate/i.test(e.sqlMessage || e.message || '');
            if (!dup) throw e;

            /* 아직 이 tradeType 이 미처리(null) 인 행 찾기 */
            const [row] = await strapi
              .documents('api::cm-trade-api-called.cm-trade-api-called')
              .findMany({
                filters: {
                  api_dg_code: dg_code,
                  api_dg_ym: ym,
                  [col]: { $null: true },
                },
                limit: 1,
              });
            if (row) return row as any;
          }
        }
      }
      return null;            // 모든 조합 완료
    },

    /* 공통 “처리 완료 타임스탬프” 함수 */
    async markDone(documentId: string, tradeType: TradeType) {
      const col = `api_${tradeType}_called_at` as const;
      await strapi
        .documents('api::cm-trade-api-called.cm-trade-api-called')
        .update({
          documentId,
          data: { [col]: dayjs().toISOString() },
        });
    },
  }),
);
