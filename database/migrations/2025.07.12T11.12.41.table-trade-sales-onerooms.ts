import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_sales_onerooms', (table) => {
    table.string('sales_oneroom_region_code', 5).alter();
    table.string('sales_oneroom_umd_name', 60).alter();
    table.string('sales_oneroom_house_type', 6).alter();
    table.string('sales_oneroom_jibun', 20).alter();
    table.string('sales_oneroom_total_floor_area', 22).alter();
    table.string('sales_oneroom_plottage_area', 22).alter();
    table.string('sales_oneroom_deal_type', 10).alter();
    table.unique(['sales_oneroom_uniq_code'], 'unique_sales_oneroom_uniq_code');
  });
}
