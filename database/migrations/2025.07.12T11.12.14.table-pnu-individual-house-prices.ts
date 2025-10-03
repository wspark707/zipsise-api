import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_individual_house_prices', (table) => {
    table.string('ihp_pnu', 30).alter();
    table.string('ihp_ld_code', 10).alter();
    table.string('ihp_ld_code_name', 50).alter();
    table.string('ihp_regstr_se_code', 10).alter();
    table.string('ihp_regstr_se_code_name', 50).alter();
    table.string('ihp_mnnm_slno', 50).alter();
    table.string('ihp_bild_regstr_esntl_no', 50).alter();
    table.string('ihp_stdr_year', 4).alter();
    table.string('ihp_stdr_mt', 2).alter();
    table.string('ihp_dong_code', 10).alter();
    table.decimal('ihp_lad_regstr_ar', 20, 2).alter();
    table.decimal('ihp_calc_plot_ar', 20, 2).alter();
    table.decimal('ihp_buld_all_tot_ar', 20, 2).alter();
    table.decimal('ihp_buld_calc_tot_ar', 20, 2).alter();
    table.string('ihp_std_land_at', 5).alter();
    table.index(['ihp_pnu'], 'ihp_pnu');
    table.index(['ihp_bild_regstr_esntl_no'], 'ihp_bild_regstr_esntl_no');
    table.unique(['ihp_pnu', 'ihp_bild_regstr_esntl_no', 'ihp_stdr_year', 'ihp_stdr_mt', 'ihp_last_updt_dt'], 'unique_ihp_pnu');
  });
}
