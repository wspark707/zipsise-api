import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_pnu_building_sns', (table) => {
    table.string('bsn_pnu', 30).alter();
    table.string('bsn_agbldg_sn', 20).alter();
    table.string('bsn_li_code', 10).alter();
    table.string('bsn_li_code_name', 50).alter();
    table.string('bsn_mnnm_slno', 50).alter();
    table.string('bsn_regstr_se_code', 10).alter();
    table.string('bsn_regstr_se_code_name', 50).alter();
    table.string('bsn_buld_name', 50).alter();
    table.string('bsn_buld_dong_name', 10).alter();
    table.string('bsn_buld_floor_name', 10).alter();
    table.string('bsn_buld_ho_name', 10).alter();
    table.string('bsn_buld_room_name', 10).alter();
    table.string('bsn_lda_qota_rate', 50).alter();
    table.string('bsn_cls_se_code', 10).alter();
    table.string('bsn_cls_se_code_name', 10).alter();
    table.string('bsn_relate_ld_emd_li_code', 10).alter();
    table.index(['bsn_pnu'], 'bsn_pnu');
    table.index(['bsn_agbldg_sn'], 'bsn_agbldg_sn');
    table.unique(['bsn_pnu', 'bsn_agbldg_sn', 'bsn_buld_dong_name', 'bsn_buld_floor_name', 'bsn_buld_ho_name', 'bsn_buld_room_name'], 'unique_bsn_pnu');
  });
}
