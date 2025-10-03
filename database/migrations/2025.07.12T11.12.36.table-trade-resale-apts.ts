import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_trade_resale_apts', (table) => {
    table.string('resale_apt_region_code', 5).alter();
    table.string('resale_apt_umd_name', 60).alter();
    table.string('resale_apt_jibun', 20).alter();
    table.string('resale_apt_use_area', 22).alter();
    table.string('resale_apt_floor', 10).alter();
    table.string('resale_apt_deal_type', 10).alter();
    table.unique(['resale_apt_uniq_code'], 'unique_resale_apt_uniq_code');
  });
}
