import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_individual_land_prices', (table) => {
    table.string('ilp_pnu', 30).alter();
    table.string('ilp_ld_code', 10).alter();
    table.string('ilp_ld_code_name', 50).alter();
    table.string('ilp_regstr_se_code', 10).alter();
    table.string('ilp_regstr_se_code_name', 50).alter();
    table.string('ilp_mnnm_slno', 50).alter();
    table.string('ilp_stdr_year', 4).alter();
    table.string('ilp_stdr_mt', 2).alter();
    table.string('ilp_std_land_at', 10).alter();
    table.index(['ilp_pnu'], 'ilp_pnu');
    table.index(['ilp_stdr_year'], 'ilp_stdr_year');
    table.index(['ilp_stdr_mt'], 'ilp_stdr_mt');
    table.unique(['ilp_pnu', 'ilp_stdr_year', 'ilp_stdr_mt', 'ilp_pblntf_de', 'ilp_last_updt_dt'], 'unique_ilp_pnu');
  });
}
