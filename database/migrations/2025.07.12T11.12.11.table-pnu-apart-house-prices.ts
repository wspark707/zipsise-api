import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_apart_house_prices', (table) => {
    table.string('ahp_pnu', 30).alter();
    table.string('ahp_ld_code', 10).alter();
    table.string('ahp_ld_code_name', 50).alter();
    table.string('ahp_regstr_se_code', 10).alter();
    table.string('ahp_regstr_se_code_name', 50).alter();
    table.string('ahp_mnnm_slno', 50).alter();
    table.string('ahp_stdr_year', 4).alter();
    table.string('ahp_stdr_mt', 2).alter();
    table.string('ahp_aphus_code', 50).alter();
    table.string('ahp_aphus_se_code', 10).alter();
    table.string('ahp_aphus_se_code_name', 50).alter();
    table.string('ahp_spcl_land_name', 50).alter();
    table.string('ahp_aphus_name', 50).alter();
    table.string('ahp_dong_name', 10).alter();
    table.string('ahp_floor_name', 10).alter();
    table.string('ahp_ho_name', 10).alter();
    table.decimal('ahp_prvuse_ar', 20, 2).alter();
    table.index(['ahp_pnu'], 'ahp_pnu');
    table.index(['ahp_stdr_year'], 'ahp_stdr_year');
    table.index(['ahp_stdr_mt'], 'ahp_stdr_mt');
    table.unique(['ahp_pnu', 'ahp_stdr_year', 'ahp_stdr_mt', 'ahp_dong_name', 'ahp_floor_name', 'ahp_ho_name', 'ahp_last_updt_dt'], 'unique_ahp_pnu');
  });
}
