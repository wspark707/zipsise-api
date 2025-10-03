import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_grades', (table) => {
    table.string('lgr_pnu', 30).alter();
    table.string('lgr_li_code', 10).alter();
    table.string('lgr_li_code_name', 50).alter();
    table.string('lgr_mnnm_slno', 50).alter();
    table.string('lgr_regstr_se_code', 10).alter();
    table.string('lgr_regstr_se_code_name', 50).alter();
    table.string('lgr_lad_grad_se_code', 10).alter();
    table.string('lgr_lad_grad_se_code_name', 50).alter();
    table.string('lgr_lad_grad', 10).alter();
    table.index(['lgr_pnu'], 'lgr_pnu');
    table.index(['lgr_regstr_se_code'], 'lgr_regstr_se_code');
    table.unique(['lgr_pnu', 'lgr_regstr_se_code', 'lgr_lad_grad_change_de', 'lgr_lad_grad_se_code'], 'unique_lgr_pnu');
  });
}
