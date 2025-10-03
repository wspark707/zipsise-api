import axios from 'axios';
import dayjs from 'dayjs';
import { factories } from '@strapi/strapi';

/* YYYYMMDD / YYYYMM / '' → YYYY-MM-DD | null */
const safeDate = (src: any): string | null => {
  if (!src) return null;

  const str = String(src);
  if (/^\d{8}$/.test(str)) {              // 20250721 → 2025-07-21
    return dayjs(str, 'YYYYMMDD').format('YYYY-MM-DD');
  }
  if (/^\d{6}$/.test(str)) {              // 202507   → 2025-07-01 (임의 1일)
    return dayjs(str, 'YYYYMM').startOf('month').format('YYYY-MM-DD');
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {  // 이미 올바른 형식
    return str;
  }
  return null;                            // 못 맞추면 null
};

const toSafeString = (v: any) =>
  typeof v === 'string' ? v : '';

/* LH 임대주택 API */
const API_BASE   = 'https://data.myhome.go.kr:443';
const API_PATH   = '/rentalHouseList';
const PAGE_LIMIT = 1000;
const MAX_PAGE   = 100;

/* 공공데이터 포털 키 */
const SERVICE_KEY = process.env.DATAGOKR_API_KEY!;

/* 시군구 코드 분리 */
const splitCode = (dg: string) => ({
  sido: dg.slice(0, 2),
  sgg : dg.slice(2, 5),
});

/* Store: 현재 페이지 */
const getStore = (strapi: any) =>
  strapi.store({ type: 'plugin', name: 'lh-list', key: 'currentPage' });

export default factories.createCoreService(
  'api::cm-rentalhouse-list.cm-rentalhouse-list',
  ({ strapi }) => {

    /* ────────────────────────────────────────────
       내부 헬퍼: 한 페이지 동기화
    ──────────────────────────────────────────── */
    async function fetchAndSave(dgCode: string, pageNo: number): Promise<number> {
      const { sido, sgg } = splitCode(dgCode);
      strapi.log.info(`[rental_house] ▶ ${dgCode} page=${pageNo} 호출`);

      const { data } = await axios.get(API_BASE + API_PATH, {
        params: {
          serviceKey: SERVICE_KEY,
          brtcCode  : sido,
          signguCode: sgg,
          numOfRows : PAGE_LIMIT,
          pageNo,
        },
        timeout: 900_000,
      });

      const items: any[] = data?.hsmpList ?? [];
      if (!items.length) {
        strapi.log.info(`[rental_house] ${dgCode} page=${pageNo} 데이터 없음`);
        return 0;
      }

      for (const raw of items) {
        /* 빈 배열 → 빈 문자열 */
        for (const k in raw)
          if (Array.isArray(raw[k]) && raw[k].length === 0) raw[k] = '';

        const uniq = [
          raw.hsmpSn,
          raw.hshldCo,
          raw.suplyTyNm,
          raw.styleNm,
          raw.suplyPrvuseAr,
          raw.suplyCmnuseAr,
        ].join('-');

        const payload: any = {
          rh_uniq_code      : uniq,
          rh_hsmp_sn        : String(raw.hsmpSn ?? ''),
          rh_instt_name     : raw.insttNm,
          rh_brtc_code      : raw.brtcCode,
          rh_brtc_name      : raw.brtcNm,
          rh_signgu_code    : raw.signguCode,
          rh_signgu_name    : raw.signguNm,
          rh_hsmp           : raw.hsmpNm,
          rh_rn_addr        : raw.rnAdres,
          rh_pnu            : raw.pnu,
          rh_compet_date    : safeDate(raw.competDe),
          rh_household_cnt  : Number(raw.hshldCo ?? 0),
          rh_supply_type    : raw.suplyTyNm,
          rh_style          : toSafeString(raw.styleNm),
          rh_exclusive_area : Number(raw.suplyPrvuseAr ?? 0),
          rh_common_area    : Number(raw.suplyCmnuseAr ?? 0),
          rh_house_type     : toSafeString(raw.houseTyNm),
          rh_heat_method_detail: toSafeString(raw.heatMthdDetailNm),
          rh_build_style    :  toSafeString(raw.buldStleNm),
          rh_elevator       : toSafeString(raw.elvtrInstlAtNm),
          rh_parking        : Number(raw.parkngCo ?? 0),
          rh_deposit        : String(raw.bassRentGtn ?? '0').replace(/,/g, ''),
          rh_monthly_rent   : String(raw.bassMtRntchrg ?? '0').replace(/,/g, ''),
          rh_deposit_conversion : String(raw.bassCnvrsGtnLmt ?? '0').replace(/,/g, ''),
          rh_message        : raw.msg,
          rh_api_called_at  : dayjs().toISOString(),
          rh_api_result     : JSON.stringify(raw),
        };

        const [existing] = await strapi
          .documents('api::cm-rentalhouse-list.cm-rentalhouse-list')
          .findMany({ filters: { rh_uniq_code: uniq }, limit: 1 });

	  try {
	    if (existing) {
	      await strapi
		.documents('api::cm-rentalhouse-list.cm-rentalhouse-list')
		.update({ documentId: String(existing.documentId), data: payload });
	    } else {
	      await strapi
		.documents('api::cm-rentalhouse-list.cm-rentalhouse-list')
		.create({ data: payload });
	    }
	  } catch (err: any) {
	    // <-- Yup ValidationError 세부 정보 확인
	  strapi.log.error(
	    '[VALIDATION ERRORS]\n' +
	    JSON.stringify(err.details?.errors, null, 2)   // pretty-print
	  );
	  throw err;
	  }

      }

      strapi.log.info(
        `[rental_house] ${dgCode} page=${pageNo} → ${items.length} rows`,
      );
      return items.length;
    }

    return {
      /* ───────── 1. 다음 구역 배치(기존) ───────── */
      async syncNextBatch() {
        const [group] = await strapi
          .documents('api::cm-dongcode-group.cm-dongcode-group')
          .findMany({
            sort : { api_rental_house_called_at: 'asc' },
            limit: 1,
            fields: ['dg_code'],
          });

        if (!group) {
          strapi.log.info('[rental_house] 대상 구역 없음');
          return;
        }

        strapi.log.info(`[rental_house] ${group.dg_code} 수집 시작`);

        for (let page = 1; page <= MAX_PAGE; page++) {
          const rows = await fetchAndSave(group.dg_code, page);
          if (rows < PAGE_LIMIT) break;             // 마지막 페이지
        }

        await strapi
          .documents('api::cm-dongcode-group.cm-dongcode-group')
          .update({
            documentId: String(group.documentId),
            data: { api_rental_house_called_at: dayjs().toISOString() },
          });

        strapi.log.info(`[rental_house] ${group.dg_code} 완료`);
      },

      /* ───────── 2. 지정 구역·페이지 동기화(신규) ───────── */
      async syncGroupPage(dgCode: string, pageNo: number): Promise<number> {
        return fetchAndSave(dgCode, pageNo);
      },

      /* ───────── 3. 지정 페이지만(현재 Store 구역) 동기화 ─── */
      async syncPage(pageNo: number): Promise<number> {
        const store = getStore(strapi);
        const currentDg = (await store.get()) ?? null;
        if (!currentDg) {
          strapi.log.info('[rental_house] Store에 구역 정보가 없습니다.');
          return 0;
        }
        return fetchAndSave(currentDg, pageNo);
      },
    };
  },
);
