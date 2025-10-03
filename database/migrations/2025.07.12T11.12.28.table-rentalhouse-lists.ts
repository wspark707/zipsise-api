import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_rentalhouse_lists', (table) => {
    table.string('rh_hsmp_sn', 10).alter();
    table.string('rh_instt_name', 100).alter();
    table.string('rh_brtc_code', 2).alter();
    table.string('rh_brtc_name', 10).alter();
    table.string('rh_signgu_code', 3).alter();
    table.string('rh_signgu_name', 10).alter();
    table.string('rh_hsmp', 200).alter();
    table.string('rh_pnu', 30).alter();
    table.string('rh_supply_type', 20).alter();
    table.string('rh_style', 200).alter();
    table.decimal('rh_exclusive_area', 19, 9).alter();
    table.decimal('rh_common_area', 19, 9).alter();
    table.string('rh_house_type', 20).alter();
    table.string('rh_heat_method_detail', 50).alter();
    table.string('rh_build_style', 50).alter();
    table.string('rh_elevator', 50).alter();
    table.unique(['rh_uniq_code'], 'rh_uniq_code');
  });
}
