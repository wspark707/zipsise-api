import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_rent_villas', (table) => {
    table.string('rent_villa_region_code', 5).alter();
    table.string('rent_villa_umd_name', 60).alter();
    table.string('rent_villa_house_type', 10).alter();
    table.string('rent_villa_jibun', 20).alter();
    table.string('rent_villa_use_area', 22).alter();
    table.string('rent_villa_floor', 10).alter();
    table.string('rent_villa_contract_term', 12).alter();
    table.string('rent_villa_contract_type', 4).alter();
    table.string('rent_villa_use_right', 4).alter();
    table.string('rent_villa_pre_deposit', 40).alter();
    table.string('rent_villa_pre_monthly_rent', 40).alter();
    table.unique(['rent_villa_uniq_code'], 'unique_rent_villa_uniq_code');
  });
}
