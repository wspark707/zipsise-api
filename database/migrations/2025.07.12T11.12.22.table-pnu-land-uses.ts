import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_land_uses', (table) => {
    table.string('lus_pnu', 30).alter();
    table.string('lus_ld_code', 10).alter();
    table.string('lus_ld_code_name', 50).alter();
    table.string('lus_regstr_se_code', 10).alter();
    table.string('lus_regstr_se_code_name', 50).alter();
    table.string('lus_mnnm_slno', 50).alter();
    table.string('lus_manage_no', 80).alter();
    table.string('lus_cnflc_at', 10).alter();
    table.string('lus_cnflc_at_name', 10).alter();
    table.string('lus_prpos_area_dstrc_code', 50).alter();
    table.string('lus_prpos_area_dstrc_code_name', 50).alter();
    table.index(['lus_pnu'], 'lus_pnu');
    table.unique(['lus_pnu', 'lus_manage_no'], 'unique_lus_pnu');
  });
}
