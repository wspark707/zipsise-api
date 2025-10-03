import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_rent_apts', (table) => {
    table.string('rent_apt_region_code', 5).alter();
    table.string('rent_apt_umd_name', 60).alter();
    table.string('rent_apt_jibun', 20).alter();
    table.string('rent_apt_use_area', 22).alter();
    table.string('rent_apt_floor', 10).alter();
    table.string('rent_apt_contract_term', 12).alter();
    table.string('rent_apt_contract_type', 4).alter();
    table.string('rent_apt_use_right', 4).alter();
    table.string('rent_apt_pre_deposit', 40).alter();
    table.string('rent_apt_pre_monthly_rent', 40).alter();
    table.unique(['rent_apt_uniq_code'], 'unique_rent_apt_uniq_code');
  });
}
