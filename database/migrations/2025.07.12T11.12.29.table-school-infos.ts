import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_school_infos', (table) => {
    table.string('sch_sd_schul_code', 20).alter();
    table.string('sch_atpt_ofcdc_sc_code', 10).alter();
    table.string('sch_atpt_ofcdc_sc_nm', 50).alter();
    table.string('sch_schul_nm', 100).alter();
    table.string('sch_eng_schul_nm', 100).alter();
    table.string('sch_schul_knd_sc_nm', 30).alter();
    table.string('sch_lctn_sc_nm', 20).alter();
    table.string('sch_ju_org_nm', 30).alter();
    table.string('sch_fond_sc_nm', 20).alter();
    table.string('sch_org_rdnzc', 10).alter();
    table.string('sch_org_rdnda', 100).alter();
    table.string('sch_org_telno', 20).alter();
    table.string('sch_hmpg_adres', 100).alter();
    table.string('sch_coedu_sc_nm', 20).alter();
    table.string('sch_org_faxno', 20).alter();
    table.string('sch_hs_sc_nm', 20).alter();
    table.string('sch_indst_specl_ccccl_exst_yn', 10).alter();
    table.string('sch_hs_gnrl_busns_sc_nm', 10).alter();
    table.string('sch_spcly_purps_hs_ord_nm', 30).alter();
    table.string('sch_ene_bfe_sehf_sc_nm', 10).alter();
    table.string('sch_dght_sc_nm', 10).alter();
    table.unique(['sch_sd_schul_code'], 'unique_sch_sd_schul_code');
  });
}
