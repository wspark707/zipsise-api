import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_characteristics', (table) => {
    table.string('plc_pnu', 30).alter();
    table.string('plc_ld_code', 10).alter();
    table.string('plc_ld_code_name', 50).alter();
    table.string('plc_regstr_se_code', 10).alter();
    table.string('plc_regstr_se_code_name', 50).alter();
    table.string('plc_mnnm_slno', 50).alter();
    table.string('plc_lad_sn', 20).alter();
    table.string('plc_stdr_year', 4).alter();
    table.string('plc_stdr_mt', 2).alter();
    table.string('plc_lndcgr_code', 10).alter();
    table.string('plc_lndcgr_code_name', 50).alter();
    table.decimal('plc_lndpcl_ar', 20, 2).alter();
    table.string('plc_prpos_area_1', 10).alter();
    table.string('plc_prpos_area_1_name', 50).alter();
    table.string('plc_prpos_area_2', 10).alter();
    table.string('plc_prpos_area_2_name', 50).alter();
    table.string('plc_lad_use_sittn', 10).alter();
    table.string('plc_lad_use_sittn_name', 20).alter();
    table.string('plc_tpgrph_hg_code', 10).alter();
    table.string('plc_tpgrph_hg_code_name', 20).alter();
    table.string('plc_tpgrph_frm_code', 10).alter();
    table.string('plc_tpgrph_frm_code_name', 20).alter();
    table.string('plc_road_side_code', 20).alter();
    table.string('plc_road_side_code_name', 20).alter();
    table.index(['plc_pnu'], 'plc_pnu');
    table.index(['plc_stdr_year'], 'plc_stdr_year');
    table.index(['plc_stdr_mt'], 'plc_stdr_mt');
    table.unique(['plc_pnu', 'plc_stdr_year', 'plc_stdr_mt', 'plc_last_updt_dt'], 'unique_plc_pnu');
  });
}
