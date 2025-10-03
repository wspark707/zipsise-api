import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_apt_management_fee_individuals', (table) => {
    table.string('ami_apt_code', 20).alter();
    table.string('ami_ym', 6).alter();
    table.index(['ami_apt_code'], 'ami_apt_code');
    table.index(['ami_ym'], 'ami_ym');
    table.index(['ami_api_called_at'], 'ami_api_called_at');
    table.unique(['ami_apt_code', 'ami_ym'], 'unique_ami_apt_code_ami_ym');
  });
}
