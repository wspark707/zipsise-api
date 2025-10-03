import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_lh_lists', (table) => {
    table.string('lh_area_name', 100).alter();
    table.string('lh_tp_code_name', 100).alter();
    table.string('lh_apt_name', 100).alter();
    table.decimal('lh_exclusive_area', 20, 2).alter();
    table.string('lh_first_movein_ym', 10).alter();
    table.index(['lh_api_called_at'], 'lh_api_called_at');
    table.unique(['lh_rnum'], 'unique_lh_rnum');
  });
}
