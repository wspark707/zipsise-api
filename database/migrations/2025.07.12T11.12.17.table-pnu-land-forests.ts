import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_forests', (table) => {
    table.string('lfr_pnu', 30).alter();
    table.string('lfr_ld_code', 10).alter();
    table.string('lfr_ld_code_name', 50).alter();
    table.string('lfr_mnnm_slno', 50).alter();
    table.string('lfr_regstr_se_code', 10).alter();
    table.string('lfr_regstr_se_code_name', 50).alter();
    table.string('lfr_lndcgr_code', 10).alter();
    table.string('lfr_lndcgr_code_name', 50).alter();
    table.decimal('lfr_lndpcl_ar', 20, 2).alter();
    table.string('lfr_posesn_se_code', 10).alter();
    table.string('lfr_posesn_se_code_name', 20).alter();
    table.string('lfr_lad_frtl_sc', 10).alter();
    table.string('lfr_lad_frtl_sc_name', 50).alter();
    table.index(['lfr_pnu'], 'lfr_pnu');
    table.index(['lfr_lad_frtl_sc'], 'lfr_lad_frtl_sc');
    table.unique(['lfr_pnu', 'lfr_lad_frtl_sc'], 'unique_lfr_pnu');
  });
}
