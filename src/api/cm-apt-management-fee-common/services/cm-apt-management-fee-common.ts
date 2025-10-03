import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* ───────── 공통 상수 ───────── */
const API_BASE   = 'https://apis.data.go.kr';
const API_KEY    = process.env.DATAGOKR_API_KEY!;   // URL-encoded
const PAGE_SIZE  = 1000;                            // 여유

/* 각 API 타입별 경로 */
const API_TYPES: Record<string, string> = {
  '1'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpVhcleMntncCostInfoV2',
  '2'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpEtcCostInfoV2',
  '3'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpOfcrkCostInfoV2',
  '4'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpClothingCostInfoV2',
  '5'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpEduTraingCostInfoV2',
  '6'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpCleaningCostInfoV2',
  '7'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpGuardCostInfoV2',
  '8'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpDisinfectionCostInfoV2',
  '9'  : '/1613000/AptCmnuseManageCostServiceV2/getHsmpElevatorMntncCostInfoV2',
  '10' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpHomeNetworkMntncCostInfoV2',
  '11' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpRepairsCostInfoV2',
  '12' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpFacilityMntncCostInfoV2',
  '13' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpSafetyCheckUpCostInfoV2',
  '14' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpDisasterPreventionCostInfoV2',
  '15' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpConsignManageFeeInfoV2',
  '16' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpLaborCostInfoV2',
  '17' : '/1613000/AptCmnuseManageCostServiceV2/getHsmpTaxdueInfoV2',
};

/* 공통: 숫자·금액 파싱 */
const toNumber = (v: any) => Number(String(v ?? 0).replace(/,/g, '') || 0);

export default factories.createCoreService(
  'api::cm-apt-management-fee-common.cm-apt-management-fee-common',
  ({ strapi }) => {
    /* ────────────────────────────────────────────
       1. API 한 종류 호출 & 반환
    ──────────────────────────────────────────── */
    async function callApi(apiPath: string, kaptCode: string, ym: string) {
      const { data } = await axios.get(API_BASE + apiPath, {
        params: {
          serviceKey: API_KEY,
          kaptCode,
          searchDate: ym,
          numOfRows: PAGE_SIZE,
          pageNo: 1,
          _type: 'json',
        },
        timeout: 900_000,
      });
      return data?.response?.body?.item ?? {};
    }

    /* ────────────────────────────────────────────
       2. 지정 단지·연월 수집
    ──────────────────────────────────────────── */
    async function collect(kaptCode: string, ym: string): Promise<void> {
      strapi.log.info(`[amc_common] ▶ ${kaptCode} ${ym} 수집 시작`);

      const result: Record<string, any> = {};
      for (const [key, path] of Object.entries(API_TYPES)) {
        strapi.log.info(`[amc_common]   call type=${key}`);
        result[key] = await callApi(path, kaptCode, ym);
      }

      /* payload 매핑 */
      const p = (type: string, field: string) => toNumber(result[type]?.[field]);

      const payload: any = {
        amc_apt_code: kaptCode,
        amc_ym      : ym,

        amc_fuel_cost        : p('1',  'fuelCost')        || undefined,
        amc_refair_cost      : p('1',  'refairCost')      || undefined,
        amc_car_insurance    : p('1',  'carInsurance')    || undefined,
        amc_car_etc          : p('1',  'carEtc')          || undefined,

        amc_care_item_cost   : p('2',  'careItemCost')    || undefined,
        amc_accounting_cost  : p('2',  'accountingCost')  || undefined,
        amc_hidden_cost      : p('2',  'hiddenCost')      || undefined,

        amc_office_supply    : p('3',  'officeSupply')    || undefined,
        amc_book_supply      : p('3',  'bookSupply')      || undefined,
        amc_transport_cost   : p('3',  'transportCost')   || undefined,

        amc_clothes_cost     : p('4',  'clothesCost')     || undefined,
        amc_edu_cost         : p('5',  'eduCost')         || undefined,
        amc_clean_cost       : p('6',  'cleanCost')       || undefined,
        amc_guard_cost       : p('7',  'guardCost')       || undefined,
        amc_disinf_cost      : p('8',  'disinfCost')      || undefined,
        amc_elev_cost        : p('9',  'elevCost')        || undefined,
        amc_hnetw_cost       : p('10', 'hnetwCost')       || undefined,

        amc_lref_cost1       : p('11', 'lrefCost1')       || undefined,
        amc_lref_cost2       : p('12', 'lrefCost2')       || undefined,
        amc_lref_cost3       : p('13', 'lrefCost3')       || undefined,
        amc_lref_cost4       : p('14', 'lrefCost4')       || undefined,

        amc_manage_cost      : p('15', 'manageCost')      || undefined,

        amc_pay              : p('16', 'pay')             || undefined,
        amc_sundry_cost      : p('16', 'sundryCost')      || undefined,
        amc_bonus            : p('16', 'bonus')           || undefined,
        amc_pension          : p('16', 'pension')         || undefined,
        amc_accident_premium : p('16', 'accidentPremium') || undefined,
        amc_employ_premium   : p('16', 'employPremium')   || undefined,
        amc_national_pension : p('16', 'nationalPension') || undefined,
        amc_health_premium   : p('16', 'healthPremium')   || undefined,
        amc_welfare_benefit  : p('16', 'welfareBenefit')  || undefined,

        amc_elect_cost       : p('17', 'electCost')       || undefined,
        amc_tel_cost         : p('17', 'telCost')         || undefined,
        amc_postage_cost     : p('17', 'postageCost')     || undefined,
        amc_taxrest_cost     : p('17', 'taxrestCost')     || undefined,

        amc_api_called_at    : dayjs().toISOString(),
      };

      /* Upsert (고유키: apt + ym) */
      const [existing] = await strapi
        .documents('api::cm-apt-management-fee-common.cm-apt-management-fee-common')
        .findMany({
          filters: {
            amc_apt_code: kaptCode,
            amc_ym: ym,
          },
          limit: 1,
        });

      if (existing) {
        await strapi
          .documents('api::cm-apt-management-fee-common.cm-apt-management-fee-common')
          .update({ documentId: String(existing.documentId), data: payload });
      } else {
        await strapi
          .documents('api::cm-apt-management-fee-common.cm-apt-management-fee-common')
          .create({ data: payload });
      }

      /* apt_list 호출시각 갱신 */
      await strapi
        .documents('api::cm-apt-list.cm-apt-list')
        .update({
          documentId: String(
            (await strapi
              .documents('api::cm-apt-list.cm-apt-list')
              .findMany({ filters: { apt_code: kaptCode }, limit: 1 }))[0]
              .documentId,
          ),
          data: { apt_api_amc_called_at: dayjs().toISOString() },
        });

      strapi.log.info(`[amc_common] ${kaptCode} ${ym} 수집 완료`);
    }

    return {

      /* ───────── 1) 단일 호출 ───────── */
      async syncCommonFeeByAptYm(kaptCode: string, ym: string) {
        await collect(kaptCode, ym);
      },

      /* ───────── 2) 오래된 단지를 자동 선택해서 배치 ───────── */
      async syncNextBatch() {
        const [apt] = await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .findMany({
            sort : { apt_api_amc_called_at: 'asc' },
            limit: 1,
            fields: ['apt_code'],
          });

        if (!apt) {
          strapi.log.info('[amc_common] 대상 아파트 없음');
          return;
        }

        /* YYYYMM: 최신 12월(예시) → 필요에 따라 로직 변경 */
        const ym = dayjs().subtract(1, 'month').format('YYYYMM');
        await collect(apt.apt_code, ym);
      },
    };
  },
);
