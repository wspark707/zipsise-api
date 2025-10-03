import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_building_registers', (table) => {
    table.string('register_id', 30).alter();
    table.unique(['register_id'], 'unique_register_id');
  });
}
