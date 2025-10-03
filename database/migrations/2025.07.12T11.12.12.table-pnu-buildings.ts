import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_buildings', (table) => {
    table.string('bld_gis_idntf_cno', 60).alter();
    table.string('bld_pnu', 30).alter();
    table.string('bld_ld_code', 10).alter();
    table.string('bld_ld_code_name', 50).alter();
    table.string('bld_regstr_se_code', 10).alter();
    table.string('bld_regstr_se_code_name', 20).alter();
    table.string('bld_mnnm_slno', 50).alter();
    table.string('bld_buld_idntfc_no', 20).alter();
    table.string('bld_agbldg_se_code', 10).alter();
    table.string('bld_agbldg_se_code_name', 50).alter();
    table.string('bld_buld_knd_code', 10).alter();
    table.string('bld_buld_knd_code_name', 50).alter();
    table.string('bld_buld_name', 50).alter();
    table.string('bld_buld_dong_name', 50).alter();
    table.decimal('bld_buld_totar', 20, 2).alter();
    table.string('bld_strct_code', 10).alter();
    table.string('bld_strct_code_name', 50).alter();
    table.string('bld_main_prpos_code', 10).alter();
    table.string('bld_main_prpos_code_name', 50).alter();
    table.string('bld_buld_hg', 50).alter();
    table.string('bld_buld_age', 10).alter();
    table.string('bld_agrde_se_code', 10).alter();
    table.string('bld_agrde_se_code_name', 10).alter();
    table.string('bld_agrde_5_class_se_code', 10).alter();
    table.string('bld_agrde_5_class_se_code_name', 10).alter();
    table.string('bld_buld_main_atach_se_code', 10).alter();
    table.string('bld_buld_main_atach_se_code_name', 50).alter();
    table.string('bld_buld_plot_ar', 20).alter();
    table.string('bld_buld_bildng_ar', 20).alter();
    table.string('bld_measrmt_rt', 20).alter();
    table.string('bld_btl_rt', 20).alter();
    table.string('bld_detail_prpos_code', 20).alter();
    table.string('bld_detail_prpos_code_name', 50).alter();
    table.string('bld_buld_prpos_cl_code', 50).alter();
    table.string('bld_buld_prpos_cl_code_name', 50).alter();
    table.index(['bld_pnu'], 'bld_pnu');
    table.unique(['bld_gis_idntf_cno'], 'unique_bld_gis_idntf_cno');
  });
}
