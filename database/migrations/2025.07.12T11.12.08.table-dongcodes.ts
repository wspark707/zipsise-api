import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_dongcodes', (table) => {
    table.string('dong_region_cd', 10).alter();
    table.string('dong_sido_cd', 2).alter();
    table.string('dong_sgg_cd', 3).alter();
    table.string('dong_umd_cd', 3).alter();
    table.string('dong_ri_cd', 2).alter();
    table.string('dong_locatjumin_cd', 10).alter();
    table.string('dong_locatjijuk_cd', 10).alter();
    table.string('dong_locatadd_nm', 50).alter();
    table.string('dong_locat_order', 3).alter();
    table.string('dong_locat_rm', 200).alter();
    table.string('dong_locathigh_cd', 10).alter();
    table.string('dong_locallow_nm', 20).alter();
    table.string('dong_adpt_de', 8).alter();
    table.index(['dong_building_register_api_called_at'], 'dong_building_register_api_called_at');
    table.unique(['dong_region_cd'], 'unique_dong_region_cd');
  });
}
