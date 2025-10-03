import axios from 'axios';
import dayjs from 'dayjs';
import { format, subMonths } from 'date-fns';
import { factories } from '@strapi/strapi';

const API_BASE = 'https://apis.data.go.kr';
const API_KEY  = process.env.DATAGOKR_API_KEY!;   // URL-encoded

/* 10개 엔드포인트 */
const ENDPOINTS: Record<number, string> = {
  1: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpHeatCostInfoV2',          // 난방
  2: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpHotWaterCostInfoV2',      // 급탕
  3: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpGasRentalFeeInfoV2',      // 가스
  4: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpElectricityCostInfoV2',   // 전기
  5: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpWaterCostInfoV2',         // 수도
  6: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpDomesticWasteFeeInfoV2',  // 폐기물
  7: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpMovingInRepresentationMtgInfoV2', // 입대의
  8: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpBuildingInsuranceFeeInfoV2',       // 건물보험
  9: '/1613000/AptIndvdlzManageCostServiceV2/getHsmpElectionOrpnsInfoV2',              // 선거위
  10:'/1613000/AptIndvdlzManageCostServiceV2/getHsmpWaterPurifierTankFeeInfoV2',       // 정화조
};

/* 숫자 파싱 */
const toNumber = (v: any) =>
  Number(String(v ?? 0).replace(/,/g, '') || 0);

/* API 호출 */
async function callApi(path: string, kaptCode: string, ym: string) {
  const { data } = await axios.get(API_BASE + path, {
    params: {
      serviceKey: API_KEY,
      kaptCode,
      searchDate: ym,
      _type: 'json',
    },
    timeout: 900_000,
  });
  return data?.response?.body?.item ?? {};
}

export default factories.createCoreService(
  'api::cm-apt-management-fee-individual.cm-apt-management-fee-individual',
  ({ strapi }) => {

    /* ────────────────────────────────────────────
       1. 지정 단지·연월 수집
    ──────────────────────────────────────────── */
    async function collect(kaptCode: string, ym: string) {
      strapi.log.info(`[ami] ▶ ${kaptCode} ${ym} 수집`);

      /* 10개 API 병렬 호출 */
      const results = await Promise.all(
        Object.values(ENDPOINTS).map((p) => callApi(p, kaptCode, ym)),
      );

      /* 매핑 테이블: dstKey → [idx, cKey, pKey] */
      const map: Record<string, [number, string, string]> = {
        ami_heat_c          : [0, 'heatC', 'heatP'],
        ami_water_hot_c     : [1, 'waterHotC', 'waterHotP'],
        ami_gas_c           : [2, 'gasC', 'gasP'],
        ami_elect_c         : [3, 'electC', 'electP'],
        ami_watercool_c     : [4, 'waterCoolC', 'waterCoolP'],
        ami_scrap           : [5, 'scrap', 'scrap'],
        ami_pre_meet        : [6, 'preMeet', 'preMeet'],
        ami_build_insu      : [7, 'buildInsu', 'buildInsu'],
        ami_election_mng    : [8, 'electionMng', 'electionMng'],
        ami_purifi          : [9, 'purifi', 'purifi'],
      };

      const payload: any = {
        ami_apt_code     : kaptCode,
        ami_ym           : ym,
        ami_api_called_at: dayjs().toISOString(),
      };

      for (const [dst, [idx, cKey, pKey]] of Object.entries(map)) {
        const item = results[idx];
        const cVal = toNumber(item[cKey]);
        const pVal = toNumber(item[pKey]);

        if (cVal > 0) payload[dst] = cVal;
        if (pVal > 0) payload[dst.replace('_c', '_p')] = pVal;
      }

      /* Upsert (apt+ym) */
      const [existing] = await strapi
        .documents('api::cm-apt-management-fee-individual.cm-apt-management-fee-individual')
        .findMany({
          filters: { ami_apt_code: kaptCode, ami_ym: ym },
          limit: 1,
        });

      if (existing) {
        await strapi
          .documents('api::cm-apt-management-fee-individual.cm-apt-management-fee-individual')
          .update({ documentId: String(existing.documentId), data: payload });
      } else {
        await strapi
          .documents('api::cm-apt-management-fee-individual.cm-apt-management-fee-individual')
          .create({ data: payload });
      }

      strapi.log.info(`[ami] ${kaptCode} ${ym} done`);
    }

    return {

      /* ───────── A. 단일 호출 ───────── */
      async syncIndividualFeeByAptYm(kaptCode: string, ym: string) {
        await collect(kaptCode, ym);
      },

      /* ───────── B. 오래된 단지 → 최근 12개월 수집 ───────── */
      async syncNextBatch() {
        const [apt] = await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .findMany({
            sort : { apt_api_ami_called_at: 'asc' },
            limit: 1,
            fields: ['apt_code'],
          });

        if (!apt) {
          strapi.log.info('[ami] no pending rows');
          return;
        }

        const now = new Date();
        for (let i = 0; i < 12; i++) {
          const ym = format(subMonths(now, i), 'yyyyMM');

          /* skip if already exists */
          const [row] = await strapi
            .documents('api::cm-apt-management-fee-individual.cm-apt-management-fee-individual')
            .findMany({
              filters: { ami_apt_code: apt.apt_code, ami_ym: ym },
              limit: 1,
            });
          if (row) continue;

          await collect(apt.apt_code, ym);
        }

        /* 호출 시각 갱신 */
        await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .update({
            documentId: String(apt.documentId),
            data: { apt_api_ami_called_at: dayjs().toISOString() },
          });

        strapi.log.info('[ami] sync complete ✅');
      },
    };
  },
);
