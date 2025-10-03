import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* ───────── 공통 상수 ───────── */
const API_KEY  = process.env.DATAGOKR_API_KEY;
const BASE_URL = 'http://apis.data.go.kr';

/* 목록(전체) */
const LIST_PATH = '/1613000/AptListService3/getTotalAptList3';
const LIST_SIZE = 1000;

/* 기본·상세 정보 */
const BASIC_PATH  = '/1613000/AptBasisInfoServiceV3/getAphusBassInfoV3';
const DETAIL_PATH = '/1613000/AptBasisInfoServiceV3/getAphusDtlInfoV3';

/* 페이지 기억용 Store */
const listStore = (strapi: any) =>
  strapi.store({ type: 'plugin', name: 'apt-list', key: 'currentPage' });

export default factories.createCoreService(
  'api::cm-apt-list.cm-apt-list',
  ({ strapi }) => {
    /* ───── 내부 헬퍼: 목록 페이지 동기화 ───── */
    async function syncListPage(pageNo: number): Promise<number> {
      strapi.log.info(`[apt_list] ▶ 호출 page=${pageNo}`);

      const { data } = await axios.get(LIST_PATH, {
        baseURL: BASE_URL,
        params : {
          pageNo,
          numOfRows: LIST_SIZE,
          type: 'json',
          serviceKey: API_KEY,
        },
        timeout: 900_000,
      });

      const items: any[] = data?.response?.body?.items ?? [];
      if (!items.length) {
        strapi.log.info(`[apt_list] page=${pageNo} 결과 없음`);
        return 0;
      }

      for (const v of items) {
        const payload: any = {
          apt_code: v.kaptCode,
          apt_name: v.kaptName,
          apt_bjd_code: v.bjdCode,
          apt_as_1: v.as1,
          apt_as_2: v.as2,
          apt_as_3: v.as3,
          apt_as_4: v.as4,
          apt_api_called_at: dayjs().toISOString(),
          apt_api_result: JSON.stringify(v),
        };

        const [existing] = await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .findMany({ filters: { apt_code: payload.apt_code }, limit: 1 });

        if (existing) {
          await strapi
            .documents('api::cm-apt-list.cm-apt-list')
            .update({ documentId: String(existing.documentId), data: payload });
        } else {
          await strapi
            .documents('api::cm-apt-list.cm-apt-list')
            .create({ data: payload });
        }
      }

      strapi.log.info(`[apt_list] page=${pageNo} → ${items.length} rows`);
      return items.length;
    }

    /* ───── 내부 헬퍼: 상세 정보 업데이트 ───── */
    async function updateAptDetail(kaptCode: string, documentId?: string) {
      strapi.log.info(`[apt_detail] ▶ 호출 kaptCode=${kaptCode}`);

      const { data: basicRes } = await axios.get(BASIC_PATH, {
        baseURL: BASE_URL,
        params : { kaptCode, serviceKey: API_KEY },
        timeout: 900_000,
      });
      const basic = basicRes?.response?.body?.item ?? {};

      const { data: dtlRes } = await axios.get(DETAIL_PATH, {
        baseURL: BASE_URL,
        params : { kaptCode, serviceKey: API_KEY },
        timeout: 900_000,
      });
      const detail = dtlRes?.response?.body?.item ?? {};

      if (!basic.kaptCode && !detail.kaptCode) {
        strapi.log.info(`[apt_detail] 결과 없음 kaptCode=${kaptCode}`);
        return;
      }

      const payload: any = {};

      /* 기본 필드 매핑 */
      if (basic.kaptCode) Object.assign(payload, {
        apt_addr                : basic.kaptAddr,
        apt_code_sale_name      : basic.codeSaleNm,
        apt_code_heat_name      : basic.codeHeatNm,
        apt_t_area              : String(basic.kaptTarea ?? ''),
        apt_dong_cnt            : Number(basic.kaptDongCnt ?? 0),
        apt_household_cnt       : Number(basic.kaptdaCnt ?? 0),
        apt_b_company           : basic.kaptBcompany,
        apt_a_company           : basic.kaptAcompany,
        apt_tel                 : basic.kaptTel,
        apt_url                 : basic.kaptUrl,
        apt_code_name           : basic.codeAptNm,
        apt_doro_juso           : basic.doroJuso,
        apt_code_manager_name   : basic.codeMgrNm,
        apt_code_hall_name      : basic.codeHallNm,
        apt_use_date            : basic.kaptUsedate,
        apt_fax                 : basic.kaptFax,
        apt_ho_cnt              : basic.hoCnt,
        apt_m_area              : basic.kaptMarea,
        apt_m_area_60           : Number(basic.kaptMparea60 ?? 0),
        apt_m_area_85           : Number(basic.kaptMparea85 ?? 0),
        apt_m_area_135          : Number(basic.kaptMparea135 ?? 0),
        apt_m_area_136          : Number(basic.kaptMparea136 ?? 0),
        apt_private_area        : basic.privArea,
        apt_top_floor           : Number(basic.kaptTopFloor ?? 0),
        apt_ktown_floor         : Number(basic.ktownFlrNo ?? 0),
        apt_base_floor          : Number(basic.kaptBaseFloor ?? 0),
        apt_elevator_cnt        : Number(basic.kaptdEcntp ?? 0),
        apt_zipcode             : basic.zipcode,
        apt_api_detail_called_at: dayjs().toISOString(),
        apt_api_basic_result    : JSON.stringify(basic),
      });

      /* 상세 필드 매핑 */
      if (detail.kaptCode) Object.assign(payload, {
        apt_code_manager        : detail.codeMgr,
        apt_manager_cnt         : Number(detail.kaptMgrCnt ?? 0),
        apt_c_company           : detail.kaptCcompany,
        apt_code_security       : detail.codeSec,
        apt_security_cnt        : Number(detail.kaptdScnt ?? 0),
        apt_sec_com             : detail.kaptdSecCom,
        apt_code_clean          : detail.codeClean,
        apt_clean_cnt           : Number(detail.kaptdClcnt ?? 0),
        apt_code_garbage        : detail.codeGarbage,
        apt_code_disinfection   : detail.codeDisinf,
        apt_d_cnt               : Number(detail.kaptdDcnt ?? 0),
        apt_d_type              : detail.disposalType,
        apt_building_structure  : detail.codeStr,
        apt_e_capacity          : detail.kaptdEcapa,
        apt_e_contract          : detail.codeEcon,
        apt_e_manager           : detail.codeEmgr,
        apt_code_f_alarm        : detail.codeFalarm,
        apt_code_w_supply       : detail.codeWsupply,
        apt_code_elevator       : detail.codeElev,
        apt_elevator_total_cnt  : Number(detail.kaptdEcnt ?? 0),
        apt_above_parking_cnt   : Number(detail.kaptdPcnt ?? 0),
        apt_under_parking_cnt   : Number(detail.kaptdPcntu ?? 0),
        apt_code_net            : detail.codeNet,
        apt_cctv_cnt            : Number(detail.kaptdCccnt ?? 0),
        apt_walfare             : detail.welfareFacility,
        apt_time_bus            : detail.kaptdWtimebus,
        apt_subway_line         : detail.subwayLine,
        apt_subway_station      : detail.subwayStation,
        apt_time_subway         : detail.kaptdWtimesub,
        apt_convenient          : detail.convenientFacility,
        apt_education           : detail.educationFacility,
        apt_above_elec_charger_cnt : Number(detail.groundElChargerCnt ?? 0),
        apt_under_elec_charger_cnt : Number(detail.undergroundElChargerCnt ?? 0),
        apt_api_detail_result   : JSON.stringify(detail),
      });

      if (documentId && Object.keys(payload).length) {
        await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .update({ documentId: documentId, data: payload });
      }
    }

    return {
      /* ───────── 1. 다음 목록 페이지 동기화 ───────── */
      async syncNextPage(): Promise<number> {
        const store = listStore(strapi);
        const current = (await store.get()) ?? 0;
        const nextPage = Number(current) + 1;
        await store.set({ value: nextPage });

        const rows = await syncListPage(nextPage);
        if (rows === 0) await store.set({ value: 0 });
        return rows;
      },

      /* ───────── 1-2. 특정 페이지 동기화 ───────── */
      async syncListPage(pageNo: number): Promise<number> {
        return syncListPage(pageNo);
      },

      /* ───────── 2. 다음 상세 대상 동기화 ───────── */
      async syncNextDetail(): Promise<boolean> {
        const [target] = await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .findMany({
            sort : { apt_api_detail_called_at: 'asc' },
            limit: 1,
            fields: ['apt_code'],     // documentId는 자동 포함
          });

        if (!target) {
          strapi.log.info('[apt_detail] no target');
          return false;
        }

        await updateAptDetail(target.apt_code, String(target.documentId));
        return true;
      },

      /* ───────── 2-2. 특정 kaptCode 상세 동기화 ───── */
      async syncDetailByKaptCode(kaptCode: string): Promise<void> {
        const [doc] = await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .findMany({
            filters: { apt_code: kaptCode },
            limit: 1,                // documentId 자동 포함
          });

        if (!doc) {
          strapi.log.info(`[apt_detail] DB에 없는 kaptCode=${kaptCode}`);
          return;
        }
        await updateAptDetail(kaptCode, String(doc.documentId));
      },
    };
  }
);
