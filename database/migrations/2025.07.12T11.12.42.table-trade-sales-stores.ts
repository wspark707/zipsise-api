import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_sales_stores', (table) => {
    table.string('sales_store_region_code', 5).alter();
    table.string('sales_store_umd_name', 60).alter();
    table.string('sales_store_jibun', 20).alter();
    table.string('sales_store_building_use', 20).alter();
    table.string('sales_store_building_type', 4).alter();
    table.string('sales_store_land_use', 20).alter();
    table.string('sales_store_floor', 10).alter();
    table.string('sales_store_deal_type', 10).alter();
    table.string('sales_store_building_area', 22).alter();
    table.string('sales_store_plottage_area', 22).alter();
    table.string('sales_store_share_dealing_type', 4).alter();
    table.unique(['sales_store_uniq_code'], 'unique_sales_store_uniq_code');
  });
}
