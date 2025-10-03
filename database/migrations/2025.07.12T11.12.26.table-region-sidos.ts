import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_region_sidos', (table) => {
    table.string('sido_code', 2).alter();
    table.string('sido_name', 50).alter();
    table.unique(['sido_code'], 'unique_sido_code');
  });
}
