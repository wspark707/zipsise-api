import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_apt_management_fee_commons', (table) => {
    table.string('amc_apt_code', 20).alter();
    table.string('amc_ym', 6).alter();
    table.index(['amc_apt_code'], 'amc_apt_code');
    table.index(['amc_ym'], 'amc_ym');
    table.index(['amc_api_called_at'], 'amc_api_called_at');
    table.unique(['amc_apt_code', 'amc_ym'], 'unique_amc_apt_code_amc_ym');
  });
}
