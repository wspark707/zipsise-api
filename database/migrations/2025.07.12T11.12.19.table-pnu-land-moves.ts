import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_moves', (table) => {
    table.string('lmv_pnu', 30).alter();
    table.string('lmv_ld_code', 10).alter();
    table.string('lmv_ld_code_name', 50).alter();
    table.string('lmv_regstr_se_code', 10).alter();
    table.string('lmv_regstr_se_code_name', 50).alter();
    table.string('lmv_mnnm_slno', 50).alter();
    table.string('lmv_lad_mvmn_hist_sn', 10).alter();
    table.string('lmv_cls_sn', 10).alter();
    table.string('lmv_lndcgr_code', 10).alter();
    table.string('lmv_lndcgr_code_name', 50).alter();
    table.decimal('lmv_lndpcl_ar', 20, 2).alter();
    table.string('lmv_lad_mvmn_prvonsh_code', 10).alter();
    table.string('lmv_lad_mvmn_prvonsh_code_name', 50).alter();
    table.string('lmv_lad_hist_sn', 10).alter();
    table.index(['lmv_pnu'], 'lmv_pnu');
    table.index(['lmv_lad_mvmn_hist_sn'], 'lmv_lad_mvmn_hist_sn');
    table.index(['lmv_lad_hist_sn '], 'lmv_lad_hist_sn ');
    table.unique(['lmv_pnu', 'lmv_lad_mvmn_hist_sn', 'lmv_lad_hist_sn'], 'unique_lmv_pnu');
  });
}
