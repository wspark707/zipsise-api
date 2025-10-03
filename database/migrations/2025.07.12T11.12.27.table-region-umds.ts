import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_region_umds', (table) => {
    table.string('umd_code', 8).alter();
    table.string('umd_name', 100).alter();
    table.string('sgg_code', 5).alter();
    table.string('sido_code', 2).alter();
    table.unique(['umd_code'], 'unique_umd_code');
  });
}
