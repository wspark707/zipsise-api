import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_api_calleds', (table) => {
    table.string('api_dg_code', 5).alter();
    table.string('api_dg_ym', 7).alter();
    table.index(['api_dg_code'], 'api_dg_code');
    table.index(['api_dg_ym'], 'api_dg_ym');
    table.index(['api_sales_apt_called_at'], 'api_sales_apt_called_at');
    table.index(['api_sales_factory_called_at'], 'api_sales_factory_called_at');
    table.index(['api_sales_land_called_at'], 'api_sales_land_called_at');
    table.index(['api_sales_officetel_called_at'], 'api_sales_officetel_called_at');
    table.index(['api_sales_oneroom_called_at'], 'api_sales_oneroom_called_at');
    table.index(['api_sales_store_called_at'], 'api_sales_store_called_at');
    table.index(['api_sales_villa_called_at'], 'api_sales_villa_called_at');
    table.index(['api_rent_apt_called_at'], 'api_rent_apt_called_at');
    table.index(['api_rent_officetel_called_at'], 'api_rent_officetel_called_at');
    table.index(['api_rent_oneroom_called_at'], 'api_rent_oneroom_called_at');
    table.index(['api_rent_villa_called_at'], 'api_rent_villa_called_at');

    table.unique(['api_dg_code', 'api_dg_ym'], 'unique_api_dg_code');
  });
}
