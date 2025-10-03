import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_lists', (table) => {
    table.string('pnu_id', 30).alter();
    table.index(['pnu_detail_api_called_at'], 'pnu_detail_api_called_at');
    table.unique(['pnu_id'], 'unique_pnu_id');
  });
}
