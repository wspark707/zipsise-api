import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_seoul_apt_management_fees', (table) => {
    table.string('amf_apt_code', 20).alter();
    table.index(['amf_apt_code'], 'amf_apt_code');
    table.index(['amf_apt_ym'], 'amf_apt_ym');
    table.unique(['amf_apt_code', 'amf_apt_ym', 'amf_apt_management_name'], 'unique_amf_apt_code');
  });
}
