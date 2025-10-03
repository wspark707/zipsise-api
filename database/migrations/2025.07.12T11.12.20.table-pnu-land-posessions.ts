import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_posessions', (table) => {
    table.string('pss_pnu', 30).alter();
    table.string('pss_ld_code', 10).alter();
    table.string('pss_ld_code_name', 50).alter();
    table.string('pss_regstr_se_code', 10).alter();
    table.string('pss_regstr_se_code_name', 50).alter();
    table.string('pss_mnnm_slno', 50).alter();
    table.string('pss_agbldg_sn', 20).alter();
    table.string('pss_buld_dong_name', 20).alter();
    table.string('pss_buld_floor_name', 20).alter();
    table.string('pss_buld_ho_name', 20).alter();
    table.string('pss_buld_room_name', 20).alter();
    table.string('pss_cnrs_psn_sn', 20).alter();
    table.string('pss_stdr_ym', 10).alter();
    table.string('pss_lndcgr_code', 10).alter();
    table.string('pss_lndcgr_code_name', 50).alter();
    table.decimal('pss_lndpcl_ar', 20, 2).alter();
    table.string('pss_posesn_se_code', 10).alter();
    table.string('pss_posesn_se_code_name', 10).alter();
    table.string('pss_resdnc_se_code', 10).alter();
    table.string('pss_resdnc_se_code_name', 50).alter();
    table.string('pss_nation_instt_se_code', 10).alter();
    table.string('pss_nation_instt_se_code_name', 50).alter();
    table.string('pss_ownship_chg_cause_code', 10).alter();
    table.string('pss_ownship_chg_cause_code_name', 50).alter();
    table.index(['pss_pnu'], 'pss_pnu');
    table.unique(['pss_pnu', 'pss_buld_dong_name', 'pss_buld_floor_name', 'pss_buld_ho_name', 'pss_buld_room_name', 'pss_stdr_ym', 'pss_ownship_chg_de', 'pss_last_updt_dt', 'pss_cnrs_psn_sn'], 'unique_pss_pnu');
  });
}
