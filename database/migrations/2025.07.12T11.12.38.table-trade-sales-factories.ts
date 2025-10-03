import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_sales_factories', (table) => {
    table.string('sales_factory_region_code', 5).alter();
    table.string('sales_factory_umd_name', 60).alter();
    table.string('sales_factory_jibun', 20).alter();
    table.string('sales_factory_building_use', 20).alter();
    table.string('sales_factory_building_type', 4).alter();
    table.string('sales_factory_land_use', 20).alter();
    table.string('sales_factory_floor', 10).alter();
    table.string('sales_factory_deal_type', 10).alter();
    table.string('sales_factory_building_area', 22).alter();
    table.string('sales_factory_plottage_area', 22).alter();
    table.string('sales_factory_share_dealing_type', 4).alter();
    table.unique(['sales_factory_uniq_code'], 'unique_sales_factory_uniq_code');
  });
}
