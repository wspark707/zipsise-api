import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_standard_prices', (table) => {
    table.string('lsp_pnu', 30).alter();
    table.string('lsp_ld_code', 10).alter();
    table.string('lsp_ld_code_name', 100).alter();
    table.string('lsp_regstr_se_code', 10).alter();
    table.string('lsp_regstr_se_code_name', 20).alter();
    table.string('lsp_mnnm_slno', 50).alter();
    table.string('lsp_std_land_sn', 50).alter();
    table.string('lsp_stdr_year', 4).alter();
    table.string('lsp_bsns_dstrc_ar', 20).alter();
    table.string('lsp_lndcgr_code', 20).alter();
    table.string('lsp_lndcgr_code_name', 20).alter();
    table.string('lsp_lndpcl_ar', 20).alter();
    table.string('lsp_prpos_area_1', 20).alter();
    table.string('lsp_prpos_area_name_1', 40).alter();
    table.string('lsp_prpos_area_2', 20).alter();
    table.string('lsp_prpos_area_name_2', 40).alter();
    table.string('lsp_prpos_dstrc_1', 20).alter();
    table.string('lsp_prpos_dstrc_name_1', 40).alter();
    table.string('lsp_prpos_dstrc_2', 20).alter();
    table.string('lsp_prpos_dstrc_name_2', 40).alter();
    table.string('lsp_cnflc_rt', 20).alter();
    table.string('lsp_lad_use_sittn', 20).alter();
    table.string('lsp_lad_use_sittn_name', 40).alter();
    table.string('lsp_tpgrph_hg_code', 20).alter();
    table.string('lsp_tpgrph_hg_code_name', 20).alter();
    table.string('lsp_tpgrph_frm_code', 20).alter();
    table.string('lsp_tpgrph_frm_code_name', 20).alter();
    table.string('lsp_road_side_code', 20).alter();
    table.string('lsp_road_side_code_name', 40).alter();
    table.string('lsp_road_dstnc_code', 20).alter();
    table.string('lsp_road_dstnc_code_name', 40).alter();
    table.string('lsp_pblntf_pclnd', 20).alter();
    table.string('lsp_stdland_posesn_se_code', 20).alter();
    table.string('lsp_stdland_posesn_se_code_name', 20).alter();
    table.string('lsp_posesn_stle', 20).alter();
    table.string('lsp_posesn_stle_name', 40).alter();
    table.index(['lsp_pnu'], 'lsp_pnu');
    table.index(['lsp_stdr_year'], 'lsp_stdr_year');
    table.unique(['lsp_pnu', 'lsp_stdr_year', 'lsp_last_updt_dt'], 'unique_lsp_pnu');
  });
}
