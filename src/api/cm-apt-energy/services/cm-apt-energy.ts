import axios from 'axios';
import dayjs from 'dayjs';
import { format, subMonths } from 'date-fns';
import { factories } from '@strapi/strapi';

/* ───────── 공통 상수 ───────── */
const API_BASE = 'https://apis.data.go.kr';
const API_KEY  = process.env.DATAGOKR_API_KEY!;   // URL-encoded

/* 2개 엔드포인트 */
const ENDPOINT_USAGE =
  '/1613000/ApHusEnergyUseInfoOfferServiceV2/getHsmpApHusUsgQtyInfoSearchV2';

const ENDPOINT_AVG =
  '/1613000/ApHusEnergyUseInfoOfferServiceV2/getHsmpAvrgEnergyUseAmountInfoSearchV2';

/* 숫자 변환 */
const toNumber = (v: any) =>
  Number(String(v ?? 0).replace(/,/g, '') || 0);

export default factories.createCoreService(
  'api::cm-apt-energy.cm-apt-energy',
  ({ strapi }) => {
    /* ────────────────────────────────────────────
       1. API 호출 헬퍼
    ──────────────────────────────────────────── */
    async function callApi(path: string, kaptCode: string, ym: string) {
      const { data } = await axios.get(API_BASE + path, {
        params: {
          serviceKey: API_KEY,
          kaptCode,
          reqDate: ym,
          _type: 'json',
        },
        timeout: 900_000,
      });
      return data?.response?.body?.item ?? {};
    }

    /* ────────────────────────────────────────────
       2. 단일 단지·연월 수집
    ──────────────────────────────────────────── */
    async function collect(kaptCode: string, ym: string) {
      strapi.log.info(`[aen] ▶ ${kaptCode} ${ym} 수집`);

      const [usage, avg] = await Promise.all([
        callApi(ENDPOINT_USAGE, kaptCode, ym),
        callApi(ENDPOINT_AVG,  kaptCode, ym),
      ]);

      const payload: any = {
        aen_apt_code : kaptCode,
        aen_ym       : ym,
        aen_api_called_at: dayjs().toISOString(),

        /* 사용량 */
        aen_heat         : toNumber(usage.heat)        || undefined,
        aen_hheat        : toNumber(usage.hheat)       || undefined,
        aen_water_hot    : toNumber(usage.waterHot)    || undefined,
        aen_hwater_hot   : toNumber(usage.hwaterHot)   || undefined,
        aen_gas          : toNumber(usage.gas)         || undefined,
        aen_hgas         : toNumber(usage.hgas)        || undefined,
        aen_elect        : toNumber(usage.elect)       || undefined,
        aen_helect       : toNumber(usage.helect)      || undefined,
        aen_water_cool   : toNumber(usage.waterCool)   || undefined,
        aen_hwater_cool  : toNumber(usage.hwaterCool)  || undefined,

        /* 평균 금액 */
        aen_avg_heat        : toNumber(avg.heat)       || undefined,
        aen_avg_water_hot   : toNumber(avg.waterHot)   || undefined,
        aen_avg_gas         : toNumber(avg.gas)        || undefined,
        aen_avg_elect       : toNumber(avg.elect)      || undefined,
        aen_avg_water_cool  : toNumber(avg.waterCool)  || undefined,
      };

      /* Upsert (apt + ym) */
      const [existing] = await strapi
        .documents('api::cm-apt-energy.cm-apt-energy')
        .findMany({
          filters: { aen_apt_code: kaptCode, aen_ym: ym },
          limit: 1,
        });

      if (existing) {
        await strapi
          .documents('api::cm-apt-energy.cm-apt-energy')
          .update({ documentId: String(existing.documentId), data: payload });
      } else {
        await strapi
          .documents('api::cm-apt-energy.cm-apt-energy')
          .create({ data: payload });
      }

      strapi.log.info(`[aen] ${kaptCode} ${ym} done`);
    }

    return {
      /* ───────── A. 단일 호출 ───────── */
      async syncEnergyByAptYm(kaptCode: string, ym: string) {
        await collect(kaptCode, ym);
      },

      /* ───────── B. 오래된 단지 → 최근 12개월 동기화 ───────── */
      async syncNextBatch() {
        const [apt] = await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .findMany({
            sort : { apt_api_aen_called_at: 'asc' },
            limit: 1,
            fields: ['apt_code'],
          });

        if (!apt) {
          strapi.log.info('[aen] no pending rows');
          return;
        }

        const now = new Date();
        for (let i = 0; i < 12; i++) {
          const ym = format(subMonths(now, i), 'yyyyMM');

          /* 이미 있으면 skip */
          const [row] = await strapi
            .documents('api::cm-apt-energy.cm-apt-energy')
            .findMany({
              filters: { aen_apt_code: apt.apt_code, aen_ym: ym },
              limit: 1,
            });
          if (row) continue;

          await collect(apt.apt_code, ym);
        }

        /* 호출 시각 업데이트 */
        await strapi
          .documents('api::cm-apt-list.cm-apt-list')
          .update({
            documentId: String(apt.documentId),
            data: { apt_api_aen_called_at: dayjs().toISOString() },
          });

        strapi.log.info('[aen] sync complete ✅');
      },
    };
  },
);
