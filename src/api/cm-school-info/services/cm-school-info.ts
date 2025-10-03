import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

interface SchoolItem { [k: string]: any }

/* NEIS 학교 정보 API */
const API_BASE = 'https://open.neis.go.kr';
const API_PATH = '/hub/schoolInfo';

export default factories.createCoreService(
  'api::cm-school-info.cm-school-info',
  ({ strapi }) => {
    /* ────────────────────────────────────────────
       1. 내부 호출 헬퍼 (데이터고 방식과 동일)
    ──────────────────────────────────────────── */
    async function neisRequest(
      pageNo = 1,
      numOfRows = 1000,
    ): Promise<SchoolItem[]> {
      const { data } = await axios.get(`${API_BASE}${API_PATH}`, {
        params: {
          KEY: process.env.NEIS_API_KEY ??
               'b77d7360f80a4e38a4bf651e6bf10d06',
          Type: 'json',
          pIndex: pageNo,
          pSize : numOfRows,
        },
        timeout: 900_000,
      });

      return data?.schoolInfo?.[1]?.row ?? [];
    }

    /* ────────────────────────────────────────────
       2. 한 페이지(최대 1,000건) 동기화
    ──────────────────────────────────────────── */
    async function syncSchoolInfoPage(
      pageNo = 1,
      numOfRows = 1000,
    ): Promise<number> {
      strapi.log.info(`[school] 요청 → page=${pageNo}`);

      const rows = await neisRequest(pageNo, numOfRows);
      strapi.log.info(
        `[school] 수신 → page=${pageNo}, rows=${rows.length}`,
      );
      if (!rows.length) return 0;

      for (const v of rows) {
        const payload: any = {
          /* 유니크 키 */
          sch_sd_schul_code: v.SD_SCHUL_CODE,

          sch_atpt_ofcdc_sc_code: v.ATPT_OFCDC_SC_CODE,
          sch_atpt_ofcdc_sc_nm: v.ATPT_OFCDC_SC_NM,
          sch_schul_nm: v.SCHUL_NM,
          sch_eng_schul_nm: v.ENG_SCHUL_NM,
          sch_schul_knd_sc_nm: v.SCHUL_KND_SC_NM,
          sch_lctn_sc_nm: v.LCTN_SC_NM,
          sch_ju_org_nm: v.JU_ORG_NM,
          sch_fond_sc_nm: v.FOND_SC_NM,
          sch_org_rdnzc: v.ORG_RDNZC,
          sch_org_rdnma: v.ORG_RDNMA,
          sch_org_rdnda: v.ORG_RDNDA,
          sch_org_telno: v.ORG_TELNO,
          sch_hmpg_adres: v.HMPG_ADRES,
          sch_coedu_sc_nm: v.COEDU_SC_NM,
          sch_org_faxno: v.ORG_FAXNO,
          sch_hs_sc_nm: v.HS_SC_NM,
          sch_indst_specl_ccccl_exst_yn: v.INDST_SPECL_CCCCL_EXST_YN,
          sch_hs_gnrl_busns_sc_nm: v.HS_GNRL_BUSNS_SC_NM,
          sch_spcly_purps_hs_ord_nm: v.SPCLY_PURPS_HS_ORD_NM,
          sch_ene_bfe_sehf_sc_nm: v.ENE_BFE_SEHF_SC_NM,
          sch_dght_sc_nm: v.DGHT_SC_NM,
          sch_fond_ymd: v.FOND_YMD ? dayjs(v.FOND_YMD).toDate() : null,
          sch_foas_memrd: v.FOAS_MEMRD ? dayjs(v.FOAS_MEMRD).toDate() : null,
          sch_load_dtm: v.LOAD_DTM ? dayjs(v.LOAD_DTM).toDate() : null,

          sch_api_called_at: dayjs().toISOString(),
          sch_api_result   : JSON.stringify(v),
        };

        /* documents API – upsert */
        const [existing] = await strapi
          .documents('api::cm-school-info.cm-school-info')
          .findMany({
            filters: { sch_sd_schul_code: payload.sch_sd_schul_code },
            limit: 1,
          });

        existing
          ? await strapi
              .documents('api::cm-school-info.cm-school-info')
              .update({
                documentId: existing.documentId,
                data: payload,
              })
          : await strapi
              .documents('api::cm-school-info.cm-school-info')
              .create({ data: payload });
      }

      return rows.length;
    }

    /* ────────────────────────────────────────────
       3. 전체 페이지 동기화
    ──────────────────────────────────────────── */
    async function syncSchoolInfoAll(): Promise<void> {
      strapi.log.info('[school] ▶ 전체 동기화 시작');
      for (let page = 1; ; page++) {
        const rows = await syncSchoolInfoPage(page);
        if (rows < 1000) break;        // 마지막 페이지
      }
      strapi.log.info('[school] ▶ 전체 동기화 완료');
    }

    /* ────────────────────────────────────────────
       4. service 내부에서 노출할 메서드
    ──────────────────────────────────────────── */
    return {
      syncSchoolInfoPage,
      syncSchoolInfoAll,
    };
  },
);
