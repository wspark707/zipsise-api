import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_sales_officetels', (table) => {
    table.string('sales_officetel_region_code', 5).alter();
    table.string('sales_officetel_umd_name', 60).alter();
    table.string('sales_officetel_jibun', 20).alter();
    table.string('sales_officetel_use_area', 22).alter();
    table.string('sales_officetel_floor', 10).alter();
    table.string('sales_officetel_deal_type', 10).alter();
    table.unique(['sales_officetel_uniq_code'], 'unique_sales_officetel_uniq_code');
  });
}
