import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_apt_energies', (table) => {
    table.string('aen_apt_code', 20).alter();
    table.string('aen_ym ', 6).alter();
    table.index(['aen_apt_code'], 'aen_apt_code');
    table.index(['aen_ym'], 'aen_ym');
    table.index(['aen_api_called_at'], 'aen_api_called_at');
    table.unique(['aen_apt_code', 'aen_ym'], 'unique_aen_apt_code_aen_ym');
  });
}
