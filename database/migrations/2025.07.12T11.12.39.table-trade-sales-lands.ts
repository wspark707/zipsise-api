import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_sales_lands', (table) => {
    table.string('sales_land_region_code', 5).alter();
    table.string('sales_land_umd_name', 60).alter();
    table.string('sales_land_jibun', 20).alter();
    table.string('sales_land_jimok', 20).alter();
    table.string('sales_land_use', 20).alter();
    table.string('sales_land_deal_type', 10).alter();
    table.string('sales_land_share_dealing_type', 10).alter();
    table.unique(['sales_land_uniq_code'], 'unique_sales_land_uniq_code');
  });
}
