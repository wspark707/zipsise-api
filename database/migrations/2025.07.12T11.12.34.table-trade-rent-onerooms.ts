import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_rent_onerooms', (table) => {
    table.string('rent_oneroom_region_code', 5).alter();
    table.string('rent_oneroom_umd_name', 60).alter();
    table.string('rent_oneroom_house_type', 6).alter();
    table.string('rent_oneroom_total_floor_area', 22).alter();
    table.string('rent_oneroom_contract_term', 12).alter();
    table.string('rent_oneroom_contract_type', 4).alter();
    table.string('rent_oneroom_use_right', 4).alter();
    table.string('rent_oneroom_pre_deposit', 40).alter();
    table.string('rent_oneroom_pre_monthly_rent', 40).alter();
    table.unique(['rent_oneroom_uniq_code'], 'unique_rent_oneroom_uniq_code');
  });
}
