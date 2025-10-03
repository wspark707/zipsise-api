import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('cm_apt_lists', (table) => {
    table.string('apt_code', 20).alter();
    table.string('apt_bjd_code', 10).alter();
    table.string('apt_as_1', 100).alter();
    table.string('apt_as_2', 100).alter();
    table.string('apt_as_3', 100).alter();
    table.string('apt_as_4', 100).alter();
    table.string('apt_code_sale_name', 20).alter();
    table.string('apt_code_heat_name', 20).alter();
    table.string('apt_t_area', 20).alter();
    table.string('apt_b_company', 50).alter();
    table.string('apt_a_company', 50).alter();
    table.string('apt_tel', 50).alter();
    table.string('apt_fax', 50).alter();
    table.string('apt_code_name', 50).alter();
    table.string('apt_code_manager_name', 50).alter();
    table.string('apt_code_hall_name', 50).alter();
    table.string('apt_use_date', 20).alter();
    table.string('apt_zipcode', 5).alter();
    table.string('apt_code_manager', 50).alter();
    table.string('apt_c_company', 50).alter();
    table.string('apt_code_security', 50).alter();
    table.string('apt_sec_com', 50).alter();
    table.string('apt_code_clean', 50).alter();
    table.string('apt_code_garbage', 50).alter();
    table.string('apt_code_disinfection', 50).alter();
    table.string('apt_d_type', 50).alter();
    table.string('apt_building_structure', 50).alter();
    table.string('apt_e_capacity', 50).alter();
    table.string('apt_e_contract', 50).alter();
    table.string('apt_e_manager', 50).alter();
    table.string('apt_code_f_alarm', 50).alter();
    table.string('apt_code_w_supply', 50).alter();
    table.string('apt_code_elevator', 50).alter();
    table.string('apt_code_net', 50).alter();
    table.string('apt_time_bus', 50).alter();
    table.string('apt_subway_line', 50).alter();
    table.string('apt_subway_station', 50).alter();
    table.string('apt_time_subway', 50).alter();
    table.index(['apt_bjd_code'], 'apt_bjd_code');
    table.index(['apt_api_ami_called_at'], 'apt_api_ami_called_at');
    table.index(['apt_api_amc_called_at'], 'apt_api_amc_called_at');
    table.index(['apt_api_aen_called_at'], 'apt_api_aen_called_at');
    table.unique(['apt_code'], 'unique_apt_code');
  });
}
