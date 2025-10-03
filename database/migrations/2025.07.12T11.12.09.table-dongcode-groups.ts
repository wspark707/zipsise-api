import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_dongcode_groups', (table) => {
    table.string('dg_code', 5).alter();
    table.index(['api_rental_house_called_at'], 'api_rental_house_called_at');
    table.unique(['dg_code'], 'unique_dg_code');
  });
}
