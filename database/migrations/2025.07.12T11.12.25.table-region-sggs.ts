import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_region_sggs', (table) => {
    table.string('sgg_code', 5).alter();
    table.string('sido_code', 2).alter();
    table.unique(['sgg_code'], 'unique_sgg_code');
  });
}
