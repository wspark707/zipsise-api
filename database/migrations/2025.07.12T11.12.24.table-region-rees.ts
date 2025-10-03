import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_region_rees', (table) => {
    table.string('ree_code', 10).alter();
    table.string('umd_code', 8).alter();
    table.string('sgg_code', 5).alter();
    table.string('sido_code', 2).alter();
    table.unique(['ree_code'], 'unique_ree_code');
  });
}
