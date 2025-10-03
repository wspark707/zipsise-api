import type { Schema, Struct } from '@strapi/strapi';

export interface AdminApiToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    encryptedKey: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::api-token'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'read-only'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::api-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::api-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminAuditLog extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_audit_logs';
  info: {
    displayName: 'Audit Log';
    pluralName: 'audit-logs';
    singularName: 'audit-log';
  };
  options: {
    draftAndPublish: false;
    timestamps: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    date: Schema.Attribute.DateTime & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::audit-log'> &
      Schema.Attribute.Private;
    payload: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    user: Schema.Attribute.Relation<'oneToOne', 'admin::user'>;
  };
}

export interface AdminPermission extends Struct.CollectionTypeSchema {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    conditions: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<[]>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::permission'> &
      Schema.Attribute.Private;
    properties: Schema.Attribute.JSON & Schema.Attribute.DefaultTo<{}>;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<'manyToOne', 'admin::role'>;
    subject: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminRole extends Struct.CollectionTypeSchema {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::role'> &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<'oneToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Schema.Attribute.DefaultTo<''>;
    expiresAt: Schema.Attribute.DateTime;
    lastUsedAt: Schema.Attribute.DateTime;
    lifespan: Schema.Attribute.BigInteger;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminTransferTokenPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'admin::transfer-token-permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    token: Schema.Attribute.Relation<'manyToOne', 'admin::transfer-token'>;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface AdminUser extends Struct.CollectionTypeSchema {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Schema.Attribute.Boolean &
      Schema.Attribute.Private &
      Schema.Attribute.DefaultTo<false>;
    lastname: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<'oneToMany', 'admin::user'> &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    registrationToken: Schema.Attribute.String & Schema.Attribute.Private;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    roles: Schema.Attribute.Relation<'manyToMany', 'admin::role'> &
      Schema.Attribute.Private;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String;
  };
}

export interface ApiCmAptEnergyCmAptEnergy extends Struct.CollectionTypeSchema {
  collectionName: 'cm_apt_energies';
  info: {
    displayName: 'cm_apt_energy';
    pluralName: 'cm-apt-energies';
    singularName: 'cm-apt-energy';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    aen_api_called_at: Schema.Attribute.DateTime;
    aen_apt_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 20;
      }>;
    aen_avg_elect: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_avg_gas: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_avg_heat: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_avg_water_cool: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    aen_avg_water_hot: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_elect: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_gas: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_heat: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_helect: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_hgas: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_hheat: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_hwater_cool: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_hwater_hot: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_water_cool: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_water_hot: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    aen_ym: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 6;
      }>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-apt-energy.cm-apt-energy'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmAptListCmAptList extends Struct.CollectionTypeSchema {
  collectionName: 'cm_apt_lists';
  info: {
    displayName: 'cm_apt_list';
    pluralName: 'cm-apt-lists';
    singularName: 'cm-apt-list';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    apt_a_company: Schema.Attribute.String;
    apt_above_elec_charger_cnt: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    apt_above_parking_cnt: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    apt_addr: Schema.Attribute.String;
    apt_api_aen_called_at: Schema.Attribute.DateTime;
    apt_api_amc_called_at: Schema.Attribute.DateTime;
    apt_api_ami_called_at: Schema.Attribute.DateTime;
    apt_api_basic_result: Schema.Attribute.Text;
    apt_api_called_at: Schema.Attribute.DateTime;
    apt_api_detail_called_at: Schema.Attribute.DateTime;
    apt_api_detail_result: Schema.Attribute.Text;
    apt_api_result: Schema.Attribute.Text;
    apt_as_1: Schema.Attribute.String;
    apt_as_2: Schema.Attribute.String;
    apt_as_3: Schema.Attribute.String;
    apt_as_4: Schema.Attribute.String;
    apt_b_company: Schema.Attribute.String;
    apt_base_floor: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_bjd_code: Schema.Attribute.String;
    apt_building_structure: Schema.Attribute.String;
    apt_c_company: Schema.Attribute.String;
    apt_cctv_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_clean_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    apt_code_clean: Schema.Attribute.String;
    apt_code_disinfection: Schema.Attribute.String;
    apt_code_elevator: Schema.Attribute.String;
    apt_code_f_alarm: Schema.Attribute.String;
    apt_code_garbage: Schema.Attribute.String;
    apt_code_hall_name: Schema.Attribute.String;
    apt_code_heat_name: Schema.Attribute.String;
    apt_code_manager: Schema.Attribute.String;
    apt_code_manager_name: Schema.Attribute.String;
    apt_code_name: Schema.Attribute.String;
    apt_code_net: Schema.Attribute.String;
    apt_code_sale_name: Schema.Attribute.String;
    apt_code_security: Schema.Attribute.String;
    apt_code_w_supply: Schema.Attribute.String;
    apt_convenient: Schema.Attribute.String;
    apt_d_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_d_type: Schema.Attribute.String;
    apt_dong_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_doro_juso: Schema.Attribute.String;
    apt_e_capacity: Schema.Attribute.String;
    apt_e_contract: Schema.Attribute.String;
    apt_e_manager: Schema.Attribute.String;
    apt_education: Schema.Attribute.String;
    apt_elevator_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_elevator_total_cnt: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    apt_fax: Schema.Attribute.String;
    apt_ho_cnt: Schema.Attribute.Integer;
    apt_household_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_ktown_floor: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_m_area: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    apt_m_area_135: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_m_area_136: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_m_area_60: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_m_area_85: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_manager_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_name: Schema.Attribute.String;
    apt_private_area: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    apt_sec_com: Schema.Attribute.String;
    apt_security_cnt: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_subway_line: Schema.Attribute.String;
    apt_subway_station: Schema.Attribute.String;
    apt_t_area: Schema.Attribute.String;
    apt_tel: Schema.Attribute.String;
    apt_time_bus: Schema.Attribute.String;
    apt_time_subway: Schema.Attribute.String;
    apt_top_floor: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    apt_under_elec_charger_cnt: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    apt_under_parking_cnt: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    apt_url: Schema.Attribute.String;
    apt_use_date: Schema.Attribute.String;
    apt_walfare: Schema.Attribute.String;
    apt_zipcode: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-apt-list.cm-apt-list'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmAptManagementFeeCommonCmAptManagementFeeCommon
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_apt_management_fee_commons';
  info: {
    displayName: 'cm_apt_management_fee_common';
    pluralName: 'cm-apt-management-fee-commons';
    singularName: 'cm-apt-management-fee-common';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amc_accident_premium: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_accounting_cost: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_api_called_at: Schema.Attribute.DateTime;
    amc_apt_code: Schema.Attribute.String & Schema.Attribute.Required;
    amc_bonus: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_book_supply: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_car_etc: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_car_insurance: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_care_item_cost: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_clean_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_clothes_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_disinf_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_edu_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_elect_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_elev_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_employ_premium: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_fuel_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_guard_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_health_premium: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_hidden_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_hnetw_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_lref_cost1: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_lref_cost2: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_lref_cost3: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_lref_cost4: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_manage_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_national_pension: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_office_supply: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_pay: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_pension: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_postage_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_refair_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_sundry_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_taxrest_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_tel_cost: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amc_transport_cost: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_welfare_benefit: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    amc_ym: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-apt-management-fee-common.cm-apt-management-fee-common'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmAptManagementFeeIndividualCmAptManagementFeeIndividual
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_apt_management_fee_individuals';
  info: {
    displayName: 'cm_apt_management_fee_individual';
    pluralName: 'cm-apt-management-fee-individuals';
    singularName: 'cm-apt-management-fee-individual';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ami_api_called_at: Schema.Attribute.DateTime;
    ami_apt_code: Schema.Attribute.String & Schema.Attribute.Required;
    ami_build_insu: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_elect_c: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_elect_p: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_election_mng: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_gas_c: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_gas_p: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_heat_c: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_heat_p: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_pre_meet: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_purifi: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_scrap: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_water_hot_c: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_water_hot_p: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_watercool_c: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_watercool_p: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    ami_ym: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-apt-management-fee-individual.cm-apt-management-fee-individual'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmBuildingRegisterCmBuildingRegister
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_building_registers';
  info: {
    displayName: 'cm_building_register';
    pluralName: 'cm-building-registers';
    singularName: 'cm-building-register';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-building-register.cm-building-register'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    reg_bjdong_code: Schema.Attribute.String;
    reg_building_name: Schema.Attribute.String;
    reg_sigungu_code: Schema.Attribute.String;
    register_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    type1_json: Schema.Attribute.JSON;
    type2_json: Schema.Attribute.JSON;
    type3_json: Schema.Attribute.JSON;
    type4_json: Schema.Attribute.JSON;
    type5_json: Schema.Attribute.JSON;
    type6_json: Schema.Attribute.JSON;
    type7_json: Schema.Attribute.JSON;
    type8_json: Schema.Attribute.JSON;
    type9_json: Schema.Attribute.JSON;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmDongcodeGroupCmDongcodeGroup
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_dongcode_groups';
  info: {
    displayName: 'cm_dongcode_group';
    pluralName: 'cm-dongcode-groups';
    singularName: 'cm-dongcode-group';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    api_rental_house_called_at: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dg_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-dongcode-group.cm-dongcode-group'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmDongcodeCmDongcode extends Struct.CollectionTypeSchema {
  collectionName: 'cm_dongcodes';
  info: {
    displayName: 'cm_dongcode';
    pluralName: 'cm-dongcodes';
    singularName: 'cm-dongcode';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    dong_adpt_de: Schema.Attribute.String;
    dong_building_register_api_called_at: Schema.Attribute.DateTime;
    dong_locallow_nm: Schema.Attribute.String;
    dong_locat_order: Schema.Attribute.Integer;
    dong_locat_rm: Schema.Attribute.String;
    dong_locatadd_nm: Schema.Attribute.String;
    dong_locathigh_cd: Schema.Attribute.String;
    dong_locatjijuk_cd: Schema.Attribute.String;
    dong_locatjumin_cd: Schema.Attribute.String;
    dong_region_cd: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    dong_ri_cd: Schema.Attribute.String;
    dong_sgg_cd: Schema.Attribute.String;
    dong_sido_cd: Schema.Attribute.String;
    dong_umd_cd: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-dongcode.cm-dongcode'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmLhListCmLhList extends Struct.CollectionTypeSchema {
  collectionName: 'cm_lh_lists';
  info: {
    displayName: 'cm_lh_list';
    pluralName: 'cm-lh-lists';
    singularName: 'cm-lh-list';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    lh_api_called_at: Schema.Attribute.DateTime;
    lh_api_result: Schema.Attribute.Text;
    lh_apt_name: Schema.Attribute.String;
    lh_area_name: Schema.Attribute.String;
    lh_deposit: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>;
    lh_exclusive_area: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    lh_first_movein_ym: Schema.Attribute.String;
    lh_household_count: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    lh_monthly_rent: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    lh_rnum: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.DefaultTo<0>;
    lh_total_household_count: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    lh_tp_code_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-lh-list.cm-lh-list'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuApartHousePriceCmPnuApartHousePrice
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_apart_house_prices';
  info: {
    displayName: 'cm_pnu_apart_house_price';
    pluralName: 'cm-pnu-apart-house-prices';
    singularName: 'cm-pnu-apart-house-price';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    ahp_aphus_code: Schema.Attribute.String;
    ahp_aphus_name: Schema.Attribute.String;
    ahp_aphus_se_code: Schema.Attribute.String;
    ahp_aphus_se_code_name: Schema.Attribute.String;
    ahp_dong_name: Schema.Attribute.String & Schema.Attribute.Required;
    ahp_floor_name: Schema.Attribute.String & Schema.Attribute.Required;
    ahp_ho_name: Schema.Attribute.String & Schema.Attribute.Required;
    ahp_last_updt_dt: Schema.Attribute.Date & Schema.Attribute.Required;
    ahp_ld_code: Schema.Attribute.String;
    ahp_ld_code_name: Schema.Attribute.String;
    ahp_mnnm_slno: Schema.Attribute.String;
    ahp_pblntf_pc: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'0'>;
    ahp_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    ahp_prvuse_ar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    ahp_regstr_se_code: Schema.Attribute.String;
    ahp_regstr_se_code_name: Schema.Attribute.String;
    ahp_spcl_land_name: Schema.Attribute.String;
    ahp_stdr_mt: Schema.Attribute.String & Schema.Attribute.Required;
    ahp_stdr_year: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-apart-house-price.cm-pnu-apart-house-price'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuBuildingSnCmPnuBuildingSn
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_building_sns';
  info: {
    displayName: 'cm_pnu_building_sn';
    pluralName: 'cm-pnu-building-sns';
    singularName: 'cm-pnu-building-sn';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bsn_agbldg_sn: Schema.Attribute.String & Schema.Attribute.Required;
    bsn_buld_dong_name: Schema.Attribute.String & Schema.Attribute.Required;
    bsn_buld_floor_name: Schema.Attribute.String & Schema.Attribute.Required;
    bsn_buld_ho_name: Schema.Attribute.String & Schema.Attribute.Required;
    bsn_buld_name: Schema.Attribute.String;
    bsn_buld_room_name: Schema.Attribute.String;
    bsn_cls_se_code: Schema.Attribute.String;
    bsn_cls_se_code_name: Schema.Attribute.String;
    bsn_last_updt_dt: Schema.Attribute.Date;
    bsn_lda_qota_rate: Schema.Attribute.String;
    bsn_li_code: Schema.Attribute.String;
    bsn_li_code_name: Schema.Attribute.String;
    bsn_mnnm_slno: Schema.Attribute.String;
    bsn_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    bsn_regstr_se_code: Schema.Attribute.String;
    bsn_regstr_se_code_name: Schema.Attribute.String;
    bsn_relate_ld_emd_li_code: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-building-sn.cm-pnu-building-sn'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuBuildingCmPnuBuilding
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_buildings';
  info: {
    displayName: 'cm_pnu_building';
    pluralName: 'cm-pnu-buildings';
    singularName: 'cm-pnu-building';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    bld_agbldg_se_code: Schema.Attribute.String;
    bld_agbldg_se_code_name: Schema.Attribute.String;
    bld_agrde_se_code: Schema.Attribute.String;
    bld_agrde_se_code_name: Schema.Attribute.String;
    bld_agrde5_class_se_code: Schema.Attribute.String;
    bld_agrde5_class_se_code_name: Schema.Attribute.String;
    bld_btl_rt: Schema.Attribute.String;
    bld_buld_age: Schema.Attribute.String;
    bld_buld_bildng_ar: Schema.Attribute.String;
    bld_buld_dong_name: Schema.Attribute.String;
    bld_buld_hg: Schema.Attribute.String;
    bld_buld_idntfc_no: Schema.Attribute.String;
    bld_buld_knd_code: Schema.Attribute.String;
    bld_buld_knd_code_name: Schema.Attribute.String;
    bld_buld_main_atach_se_code: Schema.Attribute.String;
    bld_buld_main_atach_se_code_name: Schema.Attribute.String;
    bld_buld_name: Schema.Attribute.String;
    bld_buld_plot_ar: Schema.Attribute.String;
    bld_buld_prpos_cl_code: Schema.Attribute.String;
    bld_buld_prpos_cl_code_name: Schema.Attribute.String;
    bld_buld_totar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    bld_detail_prpos_code: Schema.Attribute.String;
    bld_detail_prpos_code_name: Schema.Attribute.String;
    bld_gis_idntf_cno: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    bld_ground_floor_co: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    bld_last_updt_dt: Schema.Attribute.Date;
    bld_ld_code: Schema.Attribute.String;
    bld_ld_code_name: Schema.Attribute.String;
    bld_main_prpos_code: Schema.Attribute.String;
    bld_main_prpos_code_name: Schema.Attribute.String;
    bld_measrmt_rt: Schema.Attribute.String;
    bld_mnnm_slno: Schema.Attribute.String;
    bld_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    bld_prmisn_de: Schema.Attribute.Date;
    bld_regstr_se_code: Schema.Attribute.String;
    bld_regstr_se_code_name: Schema.Attribute.String;
    bld_strct_code: Schema.Attribute.String;
    bld_strct_code_name: Schema.Attribute.String;
    bld_undgrnd_floor_co: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    bld_use_confm_de: Schema.Attribute.Date;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-building.cm-pnu-building'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuIndividualHousePriceCmPnuIndividualHousePrice
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_individual_house_prices';
  info: {
    displayName: 'cm_pnu_individual_house_price';
    pluralName: 'cm-pnu-individual-house-prices';
    singularName: 'cm-pnu-individual-house-price';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ihp_bild_regstr_esntl_no: Schema.Attribute.String &
      Schema.Attribute.Required;
    ihp_buld_all_tot_ar: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    ihp_buld_calc_tot_ar: Schema.Attribute.Decimal &
      Schema.Attribute.DefaultTo<0>;
    ihp_calc_plot_ar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    ihp_dong_code: Schema.Attribute.String;
    ihp_house_pc: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>;
    ihp_lad_regstr_ar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    ihp_last_updt_dt: Schema.Attribute.Date & Schema.Attribute.Required;
    ihp_ld_code: Schema.Attribute.String;
    ihp_ld_code_name: Schema.Attribute.String;
    ihp_mnnm_slno: Schema.Attribute.String;
    ihp_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    ihp_regstr_se_code: Schema.Attribute.String;
    ihp_regstr_se_code_name: Schema.Attribute.String;
    ihp_std_land_at: Schema.Attribute.String;
    ihp_stdr_mt: Schema.Attribute.String & Schema.Attribute.Required;
    ihp_stdr_year: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-individual-house-price.cm-pnu-individual-house-price'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuIndividualLandPriceCmPnuIndividualLandPrice
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_individual_land_prices';
  info: {
    displayName: 'cm_pnu_individual_land_price';
    pluralName: 'cm-pnu-individual-land-prices';
    singularName: 'cm-pnu-individual-land-price';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ilp_last_updt_dt: Schema.Attribute.Date & Schema.Attribute.Required;
    ilp_ld_code: Schema.Attribute.String;
    ilp_ld_code_name: Schema.Attribute.String;
    ilp_mnnm_slno: Schema.Attribute.String;
    ilp_pblntf_de: Schema.Attribute.Date;
    ilp_pblntf_pclnd: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'0'>;
    ilp_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    ilp_regstr_se_code: Schema.Attribute.String;
    ilp_regstr_se_code_name: Schema.Attribute.String;
    ilp_std_land_at: Schema.Attribute.String;
    ilp_stdr_mt: Schema.Attribute.String & Schema.Attribute.Required;
    ilp_stdr_year: Schema.Attribute.String & Schema.Attribute.Required;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-individual-land-price.cm-pnu-individual-land-price'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandCharacteristicCmPnuLandCharacteristic
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_characteristics';
  info: {
    displayName: 'cm_pnu_land_characteristic';
    pluralName: 'cm-pnu-land-characteristics';
    singularName: 'cm-pnu-land-characteristic';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-characteristic.cm-pnu-land-characteristic'
    > &
      Schema.Attribute.Private;
    plc_lad_sn: Schema.Attribute.String;
    plc_lad_use_sittn: Schema.Attribute.String;
    plc_lad_use_sittn_name: Schema.Attribute.String;
    plc_last_updt_dt: Schema.Attribute.Date & Schema.Attribute.Required;
    plc_ld_code: Schema.Attribute.String;
    plc_ld_code_name: Schema.Attribute.String;
    plc_lndcgr_code: Schema.Attribute.String;
    plc_lndcgr_code_name: Schema.Attribute.String;
    plc_lndpcl_ar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    plc_mnnm_slno: Schema.Attribute.String;
    plc_pblntf_pclnd: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'0'>;
    plc_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    plc_prpos_area1: Schema.Attribute.String;
    plc_prpos_area1_name: Schema.Attribute.String;
    plc_prpos_area2: Schema.Attribute.String;
    plc_prpos_area2_name: Schema.Attribute.String;
    plc_regstr_se_code: Schema.Attribute.String;
    plc_regstr_se_code_name: Schema.Attribute.String;
    plc_road_side_code: Schema.Attribute.String;
    plc_road_side_code_name: Schema.Attribute.String;
    plc_stdr_mt: Schema.Attribute.String & Schema.Attribute.Required;
    plc_stdr_year: Schema.Attribute.String & Schema.Attribute.Required;
    plc_tpgrph_frm_code: Schema.Attribute.String;
    plc_tpgrph_frm_code_name: Schema.Attribute.String;
    plc_tpgrph_hg_code: Schema.Attribute.String;
    plc_tpgrph_hg_code_name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandForestCmPnuLandForest
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_forests';
  info: {
    displayName: 'cm_pnu_land_forest';
    pluralName: 'cm-pnu-land-forests';
    singularName: 'cm-pnu-land-forest';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    lfr_cnrs_psn_co: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    lfr_lad_frtl_sc: Schema.Attribute.String & Schema.Attribute.Required;
    lfr_lad_frtl_sc_name: Schema.Attribute.String;
    lfr_last_updt_dt: Schema.Attribute.Date;
    lfr_ld_code: Schema.Attribute.String;
    lfr_ld_code_name: Schema.Attribute.String;
    lfr_lndcgr_code: Schema.Attribute.String;
    lfr_lndcgr_code_name: Schema.Attribute.String;
    lfr_lndpcl_ar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    lfr_mnnm_slno: Schema.Attribute.String;
    lfr_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    lfr_posesn_se_code: Schema.Attribute.String;
    lfr_posesn_se_code_name: Schema.Attribute.String;
    lfr_regstr_se_code: Schema.Attribute.String;
    lfr_regstr_se_code_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-forest.cm-pnu-land-forest'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandGradeCmPnuLandGrade
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_grades';
  info: {
    displayName: 'cm_pnu_land_grade';
    pluralName: 'cm-pnu-land-grades';
    singularName: 'cm-pnu-land-grade';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    lgr_lad_grad: Schema.Attribute.String;
    lgr_lad_grad_change_de: Schema.Attribute.Date & Schema.Attribute.Required;
    lgr_lad_grad_se_code: Schema.Attribute.String & Schema.Attribute.Required;
    lgr_lad_grad_se_code_name: Schema.Attribute.String;
    lgr_last_updt_dt: Schema.Attribute.Date;
    lgr_li_code: Schema.Attribute.String;
    lgr_li_code_name: Schema.Attribute.String;
    lgr_mnnm_slno: Schema.Attribute.String;
    lgr_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    lgr_regstr_se_code: Schema.Attribute.String & Schema.Attribute.Required;
    lgr_regstr_se_code_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-grade.cm-pnu-land-grade'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandMoveCmPnuLandMove
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_moves';
  info: {
    displayName: 'cm_pnu_land_move';
    pluralName: 'cm-pnu-land-moves';
    singularName: 'cm-pnu-land-move';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    lmv_cls_sn: Schema.Attribute.String;
    lmv_lad_hist_sn: Schema.Attribute.String & Schema.Attribute.Required;
    lmv_lad_mvmn_de: Schema.Attribute.Date;
    lmv_lad_mvmn_ersr_de: Schema.Attribute.Date;
    lmv_lad_mvmn_hist_sn: Schema.Attribute.String & Schema.Attribute.Required;
    lmv_lad_mvmn_prvonsh_code: Schema.Attribute.String;
    lmv_lad_mvmn_prvonsh_code_name: Schema.Attribute.String;
    lmv_last_updt_dt: Schema.Attribute.Date;
    lmv_ld_code: Schema.Attribute.String;
    lmv_ld_code_name: Schema.Attribute.String;
    lmv_lndcgr_code: Schema.Attribute.String;
    lmv_lndcgr_code_name: Schema.Attribute.String;
    lmv_lndpcl_ar: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    lmv_mnnm_slno: Schema.Attribute.String;
    lmv_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    lmv_regstr_se_code: Schema.Attribute.String;
    lmv_regstr_se_code_name: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-move.cm-pnu-land-move'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandPosessionCmPnuLandPosession
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_posessions';
  info: {
    displayName: 'cm_pnu_land_posession';
    pluralName: 'cm-pnu-land-posessions';
    singularName: 'cm-pnu-land-posession';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-posession.cm-pnu-land-posession'
    > &
      Schema.Attribute.Private;
    pss_agbldg_sn: Schema.Attribute.String;
    pss_buld_dong_name: Schema.Attribute.String;
    pss_buld_floor_name: Schema.Attribute.String;
    pss_buld_ho_name: Schema.Attribute.String;
    pss_buld_room_name: Schema.Attribute.String;
    pss_cnrs_psn_co: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    pss_cnrs_psn_sn: Schema.Attribute.String;
    pss_last_updt_dt: Schema.Attribute.Date;
    pss_ld_code: Schema.Attribute.String;
    pss_ld_code_name: Schema.Attribute.String;
    pss_lndcgr_code: Schema.Attribute.String;
    pss_lndcgr_code_name: Schema.Attribute.String;
    pss_lndpcl_ar: Schema.Attribute.Decimal;
    pss_mnnm_slno: Schema.Attribute.String;
    pss_nation_instt_se_code: Schema.Attribute.String;
    pss_nation_instt_se_code_name: Schema.Attribute.String;
    pss_ownship_chg_cause_code: Schema.Attribute.String;
    pss_ownship_chg_cause_code_name: Schema.Attribute.String;
    pss_ownship_chg_de: Schema.Attribute.Date;
    pss_pblntf_pclnd: Schema.Attribute.BigInteger;
    pss_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    pss_posesn_se_code: Schema.Attribute.String;
    pss_posesn_se_code_name: Schema.Attribute.String;
    pss_regstr_se_code: Schema.Attribute.String;
    pss_regstr_se_code_name: Schema.Attribute.String;
    pss_resdnc_se_code: Schema.Attribute.String;
    pss_resdnc_se_code_name: Schema.Attribute.String;
    pss_stdr_ym: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandStandardPriceCmPnuLandStandardPrice
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_standard_prices';
  info: {
    displayName: 'cm_pnu_land_standard_price';
    pluralName: 'cm-pnu-land-standard-prices';
    singularName: 'cm-pnu-land-standard-price';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-standard-price.cm-pnu-land-standard-price'
    > &
      Schema.Attribute.Private;
    lsp_api_called_at: Schema.Attribute.DateTime;
    lsp_api_result: Schema.Attribute.Text;
    lsp_bsns_dstrc_ar: Schema.Attribute.String;
    lsp_cnflc_rt: Schema.Attribute.String;
    lsp_lad_use_sittn: Schema.Attribute.String;
    lsp_lad_use_sittn_name: Schema.Attribute.String;
    lsp_last_updt_dt: Schema.Attribute.Date & Schema.Attribute.Required;
    lsp_ld_code: Schema.Attribute.String;
    lsp_ld_code_name: Schema.Attribute.String;
    lsp_lndcgr_code: Schema.Attribute.String;
    lsp_lndcgr_code_name: Schema.Attribute.String;
    lsp_lndpcl_ar: Schema.Attribute.String;
    lsp_mnnm_slno: Schema.Attribute.String;
    lsp_pblntf_pclnd: Schema.Attribute.String;
    lsp_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    lsp_posesn_stle: Schema.Attribute.String;
    lsp_posesn_stle_name: Schema.Attribute.String;
    lsp_prpos_area_name1: Schema.Attribute.String;
    lsp_prpos_area_name2: Schema.Attribute.String;
    lsp_prpos_area1: Schema.Attribute.String;
    lsp_prpos_area2: Schema.Attribute.String;
    lsp_prpos_dstrc_name1: Schema.Attribute.String;
    lsp_prpos_dstrc_name2: Schema.Attribute.String;
    lsp_prpos_dstrc1: Schema.Attribute.String;
    lsp_prpos_dstrc2: Schema.Attribute.String;
    lsp_regstr_se_code: Schema.Attribute.String;
    lsp_regstr_se_code_name: Schema.Attribute.String;
    lsp_road_dstnc_code: Schema.Attribute.String;
    lsp_road_dstnc_code_name: Schema.Attribute.String;
    lsp_road_side_code: Schema.Attribute.String;
    lsp_road_side_code_name: Schema.Attribute.String;
    lsp_std_land_sn: Schema.Attribute.String;
    lsp_stdland_posesn_se_code: Schema.Attribute.String;
    lsp_stdland_posesn_se_code_name: Schema.Attribute.String;
    lsp_stdr_year: Schema.Attribute.String & Schema.Attribute.Required;
    lsp_tpgrph_frm_code: Schema.Attribute.String;
    lsp_tpgrph_frm_code_name: Schema.Attribute.String;
    lsp_tpgrph_hg_code: Schema.Attribute.String;
    lsp_tpgrph_hg_code_name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuLandUseCmPnuLandUse
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_land_uses';
  info: {
    displayName: 'cm_pnu_land_use';
    pluralName: 'cm-pnu-land-uses';
    singularName: 'cm-pnu-land-use';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-land-use.cm-pnu-land-use'
    > &
      Schema.Attribute.Private;
    lus_cnflc_at: Schema.Attribute.String;
    lus_cnflc_at_name: Schema.Attribute.String;
    lus_last_updt_dt: Schema.Attribute.Date;
    lus_ld_code: Schema.Attribute.String;
    lus_ld_code_name: Schema.Attribute.String;
    lus_manage_no: Schema.Attribute.String & Schema.Attribute.Required;
    lus_mnnm_slno: Schema.Attribute.String;
    lus_pnu: Schema.Attribute.String & Schema.Attribute.Required;
    lus_prpos_area_dstrc_code: Schema.Attribute.String;
    lus_prpos_area_dstrc_code_name: Schema.Attribute.String;
    lus_regist_dt: Schema.Attribute.Date;
    lus_regstr_se_code: Schema.Attribute.String;
    lus_regstr_se_code_name: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmPnuListCmPnuList extends Struct.CollectionTypeSchema {
  collectionName: 'cm_pnu_lists';
  info: {
    displayName: 'cm_pnu_list';
    pluralName: 'cm-pnu-lists';
    singularName: 'cm-pnu-list';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-pnu-list.cm-pnu-list'
    > &
      Schema.Attribute.Private;
    pnu_detail_api_called_at: Schema.Attribute.DateTime;
    pnu_id: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmRegionReeCmRegionRee extends Struct.CollectionTypeSchema {
  collectionName: 'cm_region_rees';
  info: {
    displayName: 'cm_region_ree';
    pluralName: 'cm-region-rees';
    singularName: 'cm-region-ree';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-region-ree.cm-region-ree'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    ree_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    ree_name: Schema.Attribute.String;
    sgg_code: Schema.Attribute.String;
    sido_code: Schema.Attribute.String;
    umd_code: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmRegionSggCmRegionSgg extends Struct.CollectionTypeSchema {
  collectionName: 'cm_region_sggs';
  info: {
    displayName: 'cm_region_sgg';
    pluralName: 'cm-region-sggs';
    singularName: 'cm-region-sgg';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-region-sgg.cm-region-sgg'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sgg_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sgg_energy_api_called_at: Schema.Attribute.DateTime;
    sgg_name: Schema.Attribute.String;
    sgg_umd_api_called_at: Schema.Attribute.DateTime;
    sido_code: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmRegionSidoCmRegionSido
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_region_sidos';
  info: {
    displayName: 'cm_region_sido';
    pluralName: 'cm-region-sidos';
    singularName: 'cm-region-sido';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-region-sido.cm-region-sido'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sido_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sido_energy_api_called_at: Schema.Attribute.DateTime;
    sido_lsp_done_at: Schema.Attribute.DateTime;
    sido_name: Schema.Attribute.String;
    sido_sgg_api_called_at: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmRegionUmdCmRegionUmd extends Struct.CollectionTypeSchema {
  collectionName: 'cm_region_umds';
  info: {
    displayName: 'cm_region_umd';
    pluralName: 'cm-region-umds';
    singularName: 'cm-region-umd';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-region-umd.cm-region-umd'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sgg_code: Schema.Attribute.String;
    sido_code: Schema.Attribute.String;
    umd_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    umd_name: Schema.Attribute.String;
    umd_ree_api_called_at: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmRentalhouseListCmRentalhouseList
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_rentalhouse_lists';
  info: {
    displayName: 'cm_rentalhouse_list';
    pluralName: 'cm-rentalhouse-lists';
    singularName: 'cm-rentalhouse-list';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-rentalhouse-list.cm-rentalhouse-list'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rh_api_called_at: Schema.Attribute.DateTime;
    rh_api_result: Schema.Attribute.Text;
    rh_brtc_code: Schema.Attribute.String;
    rh_brtc_name: Schema.Attribute.String;
    rh_build_style: Schema.Attribute.String;
    rh_common_area: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    rh_compet_date: Schema.Attribute.Date;
    rh_deposit: Schema.Attribute.BigInteger & Schema.Attribute.DefaultTo<'0'>;
    rh_deposit_conversion: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'0'>;
    rh_elevator: Schema.Attribute.String;
    rh_exclusive_area: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    rh_heat_method_detail: Schema.Attribute.String;
    rh_house_type: Schema.Attribute.String;
    rh_household_cnt: Schema.Attribute.Integer;
    rh_hsmp: Schema.Attribute.String;
    rh_hsmp_sn: Schema.Attribute.String;
    rh_instt_name: Schema.Attribute.String;
    rh_message: Schema.Attribute.Text;
    rh_monthly_rent: Schema.Attribute.BigInteger &
      Schema.Attribute.DefaultTo<'0'>;
    rh_parking: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    rh_pnu: Schema.Attribute.String;
    rh_rn_addr: Schema.Attribute.String;
    rh_signgu_code: Schema.Attribute.String;
    rh_signgu_name: Schema.Attribute.String;
    rh_style: Schema.Attribute.String;
    rh_supply_type: Schema.Attribute.String;
    rh_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmSchoolInfoCmSchoolInfo
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_school_infos';
  info: {
    displayName: 'cm_school_info';
    pluralName: 'cm-school-infos';
    singularName: 'cm-school-info';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-school-info.cm-school-info'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sch_atpt_ofcdc_sc_code: Schema.Attribute.String;
    sch_atpt_ofcdc_sc_nm: Schema.Attribute.String;
    sch_coedu_sc_nm: Schema.Attribute.String;
    sch_dght_sc_nm: Schema.Attribute.String;
    sch_ene_bfe_sehf_sc_nm: Schema.Attribute.String;
    sch_eng_schul_nm: Schema.Attribute.String;
    sch_foas_memrd: Schema.Attribute.Date;
    sch_fond_sc_nm: Schema.Attribute.String;
    sch_fond_ymd: Schema.Attribute.Date;
    sch_hmpg_adres: Schema.Attribute.String;
    sch_hs_gnrl_busns_sc_nm: Schema.Attribute.String;
    sch_hs_sc_nm: Schema.Attribute.String;
    sch_indst_specl_ccccl_exst_yn: Schema.Attribute.String;
    sch_ju_org_nm: Schema.Attribute.String;
    sch_lctn_sc_nm: Schema.Attribute.String;
    sch_load_dtm: Schema.Attribute.Date;
    sch_org_faxno: Schema.Attribute.String;
    sch_org_rdnda: Schema.Attribute.String;
    sch_org_rdnma: Schema.Attribute.String;
    sch_org_rdnzc: Schema.Attribute.String;
    sch_org_telno: Schema.Attribute.String;
    sch_schul_knd_sc_nm: Schema.Attribute.String;
    sch_schul_nm: Schema.Attribute.String;
    sch_sd_schul_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sch_spcly_purps_hs_ord_nm: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmSeoulAptManagementFeeCmSeoulAptManagementFee
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_seoul_apt_management_fees';
  info: {
    displayName: 'cm_seoul_apt_management_fee';
    pluralName: 'cm-seoul-apt-management-fees';
    singularName: 'cm-seoul-apt-management-fee';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    amf_apt_amount: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    amf_apt_code: Schema.Attribute.String & Schema.Attribute.Required;
    amf_apt_management_name: Schema.Attribute.String &
      Schema.Attribute.Required;
    amf_apt_name: Schema.Attribute.String;
    amf_apt_ym: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<0>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-seoul-apt-management-fee.cm-seoul-apt-management-fee'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeApiCalledCmTradeApiCalled
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_api_calleds';
  info: {
    displayName: 'cm_trade_api_called';
    pluralName: 'cm-trade-api-calleds';
    singularName: 'cm-trade-api-called';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    api_dg_code: Schema.Attribute.String & Schema.Attribute.Required;
    api_dg_ym: Schema.Attribute.String & Schema.Attribute.Required;
    api_rent_apt_called_at: Schema.Attribute.DateTime;
    api_rent_officetel_called_at: Schema.Attribute.DateTime;
    api_rent_oneroom_called_at: Schema.Attribute.DateTime;
    api_rent_villa_called_at: Schema.Attribute.DateTime;
    api_resale_apt_called_at: Schema.Attribute.DateTime;
    api_sales_apt_called_at: Schema.Attribute.DateTime;
    api_sales_factory_called_at: Schema.Attribute.DateTime;
    api_sales_land_called_at: Schema.Attribute.DateTime;
    api_sales_officetel_called_at: Schema.Attribute.DateTime;
    api_sales_oneroom_called_at: Schema.Attribute.DateTime;
    api_sales_store_called_at: Schema.Attribute.DateTime;
    api_sales_villa_called_at: Schema.Attribute.DateTime;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-api-called.cm-trade-api-called'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeRentAptCmTradeRentApt
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_rent_apts';
  info: {
    displayName: 'cm_trade_rent_apt';
    pluralName: 'cm-trade-rent-apts';
    singularName: 'cm-trade-rent-apt';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-rent-apt.cm-trade-rent-apt'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rent_apt_api_called_at: Schema.Attribute.DateTime;
    rent_apt_api_result: Schema.Attribute.Text;
    rent_apt_build_year: Schema.Attribute.String;
    rent_apt_contract_term: Schema.Attribute.String;
    rent_apt_contract_type: Schema.Attribute.String;
    rent_apt_deal_ymd: Schema.Attribute.Date;
    rent_apt_deposit: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    rent_apt_floor: Schema.Attribute.String;
    rent_apt_jibun: Schema.Attribute.String;
    rent_apt_monthly_rent: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_apt_name: Schema.Attribute.String;
    rent_apt_pre_deposit: Schema.Attribute.String;
    rent_apt_pre_monthly_rent: Schema.Attribute.String;
    rent_apt_region_code: Schema.Attribute.String;
    rent_apt_umd_name: Schema.Attribute.String;
    rent_apt_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    rent_apt_use_area: Schema.Attribute.String;
    rent_apt_use_right: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeRentOfficetelCmTradeRentOfficetel
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_rent_officetels';
  info: {
    displayName: 'cm_trade_rent_officetel';
    pluralName: 'cm-trade-rent-officetels';
    singularName: 'cm-trade-rent-officetel';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-rent-officetel.cm-trade-rent-officetel'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rent_officetel_api_called_at: Schema.Attribute.DateTime;
    rent_officetel_api_result: Schema.Attribute.Text;
    rent_officetel_build_year: Schema.Attribute.String;
    rent_officetel_contract_term: Schema.Attribute.String;
    rent_officetel_contract_type: Schema.Attribute.String;
    rent_officetel_deal_ymd: Schema.Attribute.Date;
    rent_officetel_deposit: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_officetel_floor: Schema.Attribute.String;
    rent_officetel_jibun: Schema.Attribute.String;
    rent_officetel_monthly_rent: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_officetel_name: Schema.Attribute.String;
    rent_officetel_pre_deposit: Schema.Attribute.String;
    rent_officetel_pre_monthly_rent: Schema.Attribute.String;
    rent_officetel_region_code: Schema.Attribute.String;
    rent_officetel_umd_name: Schema.Attribute.String;
    rent_officetel_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    rent_officetel_use_area: Schema.Attribute.String;
    rent_officetel_use_right: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeRentOneroomCmTradeRentOneroom
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_rent_onerooms';
  info: {
    displayName: 'cm_trade_rent_oneroom';
    pluralName: 'cm-trade-rent-onerooms';
    singularName: 'cm-trade-rent-oneroom';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-rent-oneroom.cm-trade-rent-oneroom'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rent_oneroom_api_called_at: Schema.Attribute.DateTime;
    rent_oneroom_api_result: Schema.Attribute.Text;
    rent_oneroom_build_year: Schema.Attribute.String;
    rent_oneroom_contract_term: Schema.Attribute.String;
    rent_oneroom_contract_type: Schema.Attribute.String;
    rent_oneroom_deal_ymd: Schema.Attribute.Date;
    rent_oneroom_deposit: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_oneroom_house_type: Schema.Attribute.String;
    rent_oneroom_monthly_rent: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_oneroom_pre_deposit: Schema.Attribute.String;
    rent_oneroom_pre_monthly_rent: Schema.Attribute.String;
    rent_oneroom_region_code: Schema.Attribute.String;
    rent_oneroom_total_floor_area: Schema.Attribute.String;
    rent_oneroom_umd_name: Schema.Attribute.String;
    rent_oneroom_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    rent_oneroom_use_right: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeRentVillaCmTradeRentVilla
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_rent_villas';
  info: {
    displayName: 'cm_trade_rent_villa';
    pluralName: 'cm-trade-rent-villas';
    singularName: 'cm-trade-rent-villa';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-rent-villa.cm-trade-rent-villa'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    rent_villa_api_called_at: Schema.Attribute.DateTime;
    rent_villa_api_result: Schema.Attribute.Text;
    rent_villa_build_year: Schema.Attribute.String;
    rent_villa_contract_term: Schema.Attribute.String;
    rent_villa_contract_type: Schema.Attribute.String;
    rent_villa_deal_ymd: Schema.Attribute.Date;
    rent_villa_deposit: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_villa_floor: Schema.Attribute.String;
    rent_villa_house_type: Schema.Attribute.String;
    rent_villa_jibun: Schema.Attribute.String;
    rent_villa_monthly_rent: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    rent_villa_name: Schema.Attribute.String;
    rent_villa_pre_deposit: Schema.Attribute.String;
    rent_villa_pre_monthly_rent: Schema.Attribute.String;
    rent_villa_region_code: Schema.Attribute.String;
    rent_villa_umd_name: Schema.Attribute.String;
    rent_villa_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    rent_villa_use_area: Schema.Attribute.String;
    rent_villa_use_right: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeResaleAptCmTradeResaleApt
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_resale_apts';
  info: {
    displayName: 'cm_trade_resale_apt';
    pluralName: 'cm-trade-resale-apts';
    singularName: 'cm-trade-resale-apt';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-resale-apt.cm-trade-resale-apt'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    resale_apt_api_called_at: Schema.Attribute.DateTime;
    resale_apt_api_result: Schema.Attribute.Text;
    resale_apt_buyer: Schema.Attribute.String;
    resale_apt_cdeal: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    resale_apt_cdeal_day: Schema.Attribute.Date;
    resale_apt_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    resale_apt_deal_type: Schema.Attribute.String;
    resale_apt_deal_ymd: Schema.Attribute.Date;
    resale_apt_estate_agency: Schema.Attribute.String;
    resale_apt_floor: Schema.Attribute.String;
    resale_apt_jibun: Schema.Attribute.String;
    resale_apt_name: Schema.Attribute.String;
    resale_apt_ownership: Schema.Attribute.String;
    resale_apt_region_code: Schema.Attribute.String;
    resale_apt_seller: Schema.Attribute.String;
    resale_apt_umd_name: Schema.Attribute.String;
    resale_apt_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    resale_apt_use_area: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesAptCmTradeSalesApt
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_apts';
  info: {
    displayName: 'cm_trade_sales_apt';
    pluralName: 'cm-trade-sales-apts';
    singularName: 'cm-trade-sales-apt';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-apt.cm-trade-sales-apt'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_apt_api_called_at: Schema.Attribute.DateTime;
    sales_apt_api_result: Schema.Attribute.Text;
    sales_apt_build_year: Schema.Attribute.String;
    sales_apt_buyer: Schema.Attribute.String;
    sales_apt_cdeal: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    sales_apt_cdeal_day: Schema.Attribute.Date;
    sales_apt_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_apt_deal_type: Schema.Attribute.String;
    sales_apt_deal_ymd: Schema.Attribute.Date;
    sales_apt_dong: Schema.Attribute.String;
    sales_apt_estate_agency: Schema.Attribute.String;
    sales_apt_floor: Schema.Attribute.String;
    sales_apt_jibun: Schema.Attribute.String;
    sales_apt_landlease: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_apt_name: Schema.Attribute.String;
    sales_apt_region_code: Schema.Attribute.String;
    sales_apt_regist_date: Schema.Attribute.Date;
    sales_apt_seller: Schema.Attribute.String;
    sales_apt_umd_name: Schema.Attribute.String;
    sales_apt_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sales_apt_use_area: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesFactoryCmTradeSalesFactory
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_factories';
  info: {
    displayName: 'cm_trade_sales_factory';
    pluralName: 'cm-trade-sales-factories';
    singularName: 'cm-trade-sales-factory';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-factory.cm-trade-sales-factory'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_factory_api_called_at: Schema.Attribute.DateTime;
    sales_factory_api_result: Schema.Attribute.Text;
    sales_factory_build_year: Schema.Attribute.String;
    sales_factory_building_area: Schema.Attribute.String;
    sales_factory_building_type: Schema.Attribute.String;
    sales_factory_building_use: Schema.Attribute.String;
    sales_factory_buyer: Schema.Attribute.String;
    sales_factory_cdeal: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_factory_cdeal_day: Schema.Attribute.Date;
    sales_factory_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_factory_deal_type: Schema.Attribute.String;
    sales_factory_deal_ymd: Schema.Attribute.Date;
    sales_factory_estate_agency: Schema.Attribute.String;
    sales_factory_floor: Schema.Attribute.String;
    sales_factory_jibun: Schema.Attribute.String;
    sales_factory_land_use: Schema.Attribute.String;
    sales_factory_plottage_area: Schema.Attribute.String;
    sales_factory_region_code: Schema.Attribute.String;
    sales_factory_seller: Schema.Attribute.String;
    sales_factory_share_dealing_type: Schema.Attribute.String;
    sales_factory_umd_name: Schema.Attribute.String;
    sales_factory_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesLandCmTradeSalesLand
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_lands';
  info: {
    displayName: 'cm_trade_sales_land';
    pluralName: 'cm-trade-sales-lands';
    singularName: 'cm-trade-sales-land';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-land.cm-trade-sales-land'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_land_api_called_at: Schema.Attribute.DateTime;
    sales_land_api_result: Schema.Attribute.Text;
    sales_land_cdeal: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    sales_land_cdeal_day: Schema.Attribute.Date;
    sales_land_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_land_deal_type: Schema.Attribute.String;
    sales_land_deal_ymd: Schema.Attribute.Date;
    sales_land_estate_agency: Schema.Attribute.String;
    sales_land_jibun: Schema.Attribute.String;
    sales_land_jimok: Schema.Attribute.String;
    sales_land_region_code: Schema.Attribute.String;
    sales_land_share_dealing_type: Schema.Attribute.String;
    sales_land_umd_name: Schema.Attribute.String;
    sales_land_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sales_land_use: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesOfficetelCmTradeSalesOfficetel
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_officetels';
  info: {
    displayName: 'cm_trade_sales_officetel';
    pluralName: 'cm-trade-sales-officetels';
    singularName: 'cm-trade-sales-officetel';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-officetel.cm-trade-sales-officetel'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_officetel_api_called_at: Schema.Attribute.DateTime;
    sales_officetel_api_result: Schema.Attribute.Text;
    sales_officetel_build_year: Schema.Attribute.String;
    sales_officetel_buyer: Schema.Attribute.String;
    sales_officetel_cdeal: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_officetel_cdeal_day: Schema.Attribute.Date;
    sales_officetel_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_officetel_deal_type: Schema.Attribute.String;
    sales_officetel_deal_ymd: Schema.Attribute.Date;
    sales_officetel_estate_agency: Schema.Attribute.String;
    sales_officetel_floor: Schema.Attribute.String;
    sales_officetel_jibun: Schema.Attribute.String;
    sales_officetel_name: Schema.Attribute.String;
    sales_officetel_region_code: Schema.Attribute.String;
    sales_officetel_seller: Schema.Attribute.String;
    sales_officetel_umd_name: Schema.Attribute.String;
    sales_officetel_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sales_officetel_use_area: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesOneroomCmTradeSalesOneroom
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_onerooms';
  info: {
    displayName: 'cm_trade_sales_oneroom';
    pluralName: 'cm-trade-sales-onerooms';
    singularName: 'cm-trade-sales-oneroom';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-oneroom.cm-trade-sales-oneroom'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_oneroom_api_called_at: Schema.Attribute.DateTime;
    sales_oneroom_api_result: Schema.Attribute.Text;
    sales_oneroom_build_year: Schema.Attribute.String;
    sales_oneroom_buyer: Schema.Attribute.String;
    sales_oneroom_cdeal: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_oneroom_cdeal_day: Schema.Attribute.Date;
    sales_oneroom_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_oneroom_deal_type: Schema.Attribute.String;
    sales_oneroom_deal_ymd: Schema.Attribute.Date;
    sales_oneroom_estate_agency: Schema.Attribute.String;
    sales_oneroom_house_type: Schema.Attribute.String;
    sales_oneroom_jibun: Schema.Attribute.String;
    sales_oneroom_plottage_area: Schema.Attribute.String;
    sales_oneroom_region_code: Schema.Attribute.String;
    sales_oneroom_seller: Schema.Attribute.String;
    sales_oneroom_total_floor_area: Schema.Attribute.String;
    sales_oneroom_umd_name: Schema.Attribute.String;
    sales_oneroom_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesStoreCmTradeSalesStore
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_stores';
  info: {
    displayName: 'cm_trade_sales_store';
    pluralName: 'cm-trade-sales-stores';
    singularName: 'cm-trade-sales-store';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-store.cm-trade-sales-store'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_store_api_called_at: Schema.Attribute.DateTime;
    sales_store_api_result: Schema.Attribute.Text;
    sales_store_build_year: Schema.Attribute.String;
    sales_store_building_area: Schema.Attribute.String;
    sales_store_building_type: Schema.Attribute.String;
    sales_store_building_use: Schema.Attribute.String;
    sales_store_buyer: Schema.Attribute.String;
    sales_store_cdeal: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    sales_store_cdeal_day: Schema.Attribute.Date;
    sales_store_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_store_deal_type: Schema.Attribute.String;
    sales_store_deal_ymd: Schema.Attribute.Date;
    sales_store_estate_agency: Schema.Attribute.String;
    sales_store_floor: Schema.Attribute.String;
    sales_store_jibun: Schema.Attribute.String;
    sales_store_land_use: Schema.Attribute.String;
    sales_store_plottage_area: Schema.Attribute.String;
    sales_store_region_code: Schema.Attribute.String;
    sales_store_seller: Schema.Attribute.String;
    sales_store_share_dealing_type: Schema.Attribute.String;
    sales_store_umd_name: Schema.Attribute.String;
    sales_store_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface ApiCmTradeSalesVillaCmTradeSalesVilla
  extends Struct.CollectionTypeSchema {
  collectionName: 'cm_trade_sales_villas';
  info: {
    displayName: 'cm_trade_sales_villa';
    pluralName: 'cm-trade-sales-villas';
    singularName: 'cm-trade-sales-villa';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'api::cm-trade-sales-villa.cm-trade-sales-villa'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    sales_villa_api_called_at: Schema.Attribute.DateTime;
    sales_villa_api_result: Schema.Attribute.Text;
    sales_villa_build_year: Schema.Attribute.String;
    sales_villa_buyer: Schema.Attribute.String;
    sales_villa_cdeal: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<0>;
    sales_villa_cdeal_day: Schema.Attribute.Date;
    sales_villa_deal_amount: Schema.Attribute.Integer &
      Schema.Attribute.DefaultTo<0>;
    sales_villa_deal_type: Schema.Attribute.String;
    sales_villa_deal_ymd: Schema.Attribute.Date;
    sales_villa_dong: Schema.Attribute.String;
    sales_villa_estate_agency: Schema.Attribute.String;
    sales_villa_floor: Schema.Attribute.String;
    sales_villa_house_type: Schema.Attribute.String;
    sales_villa_jibun: Schema.Attribute.String;
    sales_villa_land_area: Schema.Attribute.String;
    sales_villa_name: Schema.Attribute.String;
    sales_villa_region_code: Schema.Attribute.String;
    sales_villa_regist_date: Schema.Attribute.Date;
    sales_villa_seller: Schema.Attribute.String;
    sales_villa_umd_name: Schema.Attribute.String;
    sales_villa_uniq_code: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    sales_villa_use_area: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesRelease
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    publishedAt: Schema.Attribute.DateTime;
    releasedAt: Schema.Attribute.DateTime;
    scheduledAt: Schema.Attribute.DateTime;
    status: Schema.Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Schema.Attribute.Required;
    timezone: Schema.Attribute.String;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    entryDocumentId: Schema.Attribute.String;
    isEntryValid: Schema.Attribute.Boolean;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::content-releases.release-action'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    release: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Schema.Attribute.Enumeration<['publish', 'unpublish']> &
      Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginI18NLocale extends Struct.CollectionTypeSchema {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Schema.Attribute.String & Schema.Attribute.Unique;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::i18n.locale'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflow
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows';
  info: {
    description: '';
    displayName: 'Workflow';
    name: 'Workflow';
    pluralName: 'workflows';
    singularName: 'workflow';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentTypes: Schema.Attribute.JSON &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'[]'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    stageRequiredToPublish: Schema.Attribute.Relation<
      'oneToOne',
      'plugin::review-workflows.workflow-stage'
    >;
    stages: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginReviewWorkflowsWorkflowStage
  extends Struct.CollectionTypeSchema {
  collectionName: 'strapi_workflows_stages';
  info: {
    description: '';
    displayName: 'Stages';
    name: 'Workflow Stage';
    pluralName: 'workflow-stages';
    singularName: 'workflow-stage';
  };
  options: {
    draftAndPublish: false;
    version: '1.1.0';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#4945FF'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::review-workflows.workflow-stage'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String;
    permissions: Schema.Attribute.Relation<'manyToMany', 'admin::permission'>;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    workflow: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::review-workflows.workflow'
    >;
  };
}

export interface PluginUploadFile extends Struct.CollectionTypeSchema {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    ext: Schema.Attribute.String;
    folder: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'> &
      Schema.Attribute.Private;
    folderPath: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    formats: Schema.Attribute.JSON;
    hash: Schema.Attribute.String & Schema.Attribute.Required;
    height: Schema.Attribute.Integer;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.file'
    > &
      Schema.Attribute.Private;
    mime: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    previewUrl: Schema.Attribute.String;
    provider: Schema.Attribute.String & Schema.Attribute.Required;
    provider_metadata: Schema.Attribute.JSON;
    publishedAt: Schema.Attribute.DateTime;
    related: Schema.Attribute.Relation<'morphToMany'>;
    size: Schema.Attribute.Decimal & Schema.Attribute.Required;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    url: Schema.Attribute.String & Schema.Attribute.Required;
    width: Schema.Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Struct.CollectionTypeSchema {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.folder'>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    files: Schema.Attribute.Relation<'oneToMany', 'plugin::upload.file'>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::upload.folder'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    parent: Schema.Attribute.Relation<'manyToOne', 'plugin::upload.folder'>;
    path: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    pathId: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.Unique;
    publishedAt: Schema.Attribute.DateTime;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Schema.Attribute.String & Schema.Attribute.Required;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    > &
      Schema.Attribute.Private;
    publishedAt: Schema.Attribute.DateTime;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    description: Schema.Attribute.String;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.role'
    > &
      Schema.Attribute.Private;
    name: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    publishedAt: Schema.Attribute.DateTime;
    type: Schema.Attribute.String & Schema.Attribute.Unique;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    users: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser
  extends Struct.CollectionTypeSchema {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    confirmationToken: Schema.Attribute.String & Schema.Attribute.Private;
    confirmed: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    createdAt: Schema.Attribute.DateTime;
    createdBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    email: Schema.Attribute.Email &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    locale: Schema.Attribute.String & Schema.Attribute.Private;
    localizations: Schema.Attribute.Relation<
      'oneToMany',
      'plugin::users-permissions.user'
    > &
      Schema.Attribute.Private;
    password: Schema.Attribute.Password &
      Schema.Attribute.Private &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Schema.Attribute.String;
    publishedAt: Schema.Attribute.DateTime;
    resetPasswordToken: Schema.Attribute.String & Schema.Attribute.Private;
    role: Schema.Attribute.Relation<
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Schema.Attribute.DateTime;
    updatedBy: Schema.Attribute.Relation<'oneToOne', 'admin::user'> &
      Schema.Attribute.Private;
    username: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.Unique &
      Schema.Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ContentTypeSchemas {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::audit-log': AdminAuditLog;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::cm-apt-energy.cm-apt-energy': ApiCmAptEnergyCmAptEnergy;
      'api::cm-apt-list.cm-apt-list': ApiCmAptListCmAptList;
      'api::cm-apt-management-fee-common.cm-apt-management-fee-common': ApiCmAptManagementFeeCommonCmAptManagementFeeCommon;
      'api::cm-apt-management-fee-individual.cm-apt-management-fee-individual': ApiCmAptManagementFeeIndividualCmAptManagementFeeIndividual;
      'api::cm-building-register.cm-building-register': ApiCmBuildingRegisterCmBuildingRegister;
      'api::cm-dongcode-group.cm-dongcode-group': ApiCmDongcodeGroupCmDongcodeGroup;
      'api::cm-dongcode.cm-dongcode': ApiCmDongcodeCmDongcode;
      'api::cm-lh-list.cm-lh-list': ApiCmLhListCmLhList;
      'api::cm-pnu-apart-house-price.cm-pnu-apart-house-price': ApiCmPnuApartHousePriceCmPnuApartHousePrice;
      'api::cm-pnu-building-sn.cm-pnu-building-sn': ApiCmPnuBuildingSnCmPnuBuildingSn;
      'api::cm-pnu-building.cm-pnu-building': ApiCmPnuBuildingCmPnuBuilding;
      'api::cm-pnu-individual-house-price.cm-pnu-individual-house-price': ApiCmPnuIndividualHousePriceCmPnuIndividualHousePrice;
      'api::cm-pnu-individual-land-price.cm-pnu-individual-land-price': ApiCmPnuIndividualLandPriceCmPnuIndividualLandPrice;
      'api::cm-pnu-land-characteristic.cm-pnu-land-characteristic': ApiCmPnuLandCharacteristicCmPnuLandCharacteristic;
      'api::cm-pnu-land-forest.cm-pnu-land-forest': ApiCmPnuLandForestCmPnuLandForest;
      'api::cm-pnu-land-grade.cm-pnu-land-grade': ApiCmPnuLandGradeCmPnuLandGrade;
      'api::cm-pnu-land-move.cm-pnu-land-move': ApiCmPnuLandMoveCmPnuLandMove;
      'api::cm-pnu-land-posession.cm-pnu-land-posession': ApiCmPnuLandPosessionCmPnuLandPosession;
      'api::cm-pnu-land-standard-price.cm-pnu-land-standard-price': ApiCmPnuLandStandardPriceCmPnuLandStandardPrice;
      'api::cm-pnu-land-use.cm-pnu-land-use': ApiCmPnuLandUseCmPnuLandUse;
      'api::cm-pnu-list.cm-pnu-list': ApiCmPnuListCmPnuList;
      'api::cm-region-ree.cm-region-ree': ApiCmRegionReeCmRegionRee;
      'api::cm-region-sgg.cm-region-sgg': ApiCmRegionSggCmRegionSgg;
      'api::cm-region-sido.cm-region-sido': ApiCmRegionSidoCmRegionSido;
      'api::cm-region-umd.cm-region-umd': ApiCmRegionUmdCmRegionUmd;
      'api::cm-rentalhouse-list.cm-rentalhouse-list': ApiCmRentalhouseListCmRentalhouseList;
      'api::cm-school-info.cm-school-info': ApiCmSchoolInfoCmSchoolInfo;
      'api::cm-seoul-apt-management-fee.cm-seoul-apt-management-fee': ApiCmSeoulAptManagementFeeCmSeoulAptManagementFee;
      'api::cm-trade-api-called.cm-trade-api-called': ApiCmTradeApiCalledCmTradeApiCalled;
      'api::cm-trade-rent-apt.cm-trade-rent-apt': ApiCmTradeRentAptCmTradeRentApt;
      'api::cm-trade-rent-officetel.cm-trade-rent-officetel': ApiCmTradeRentOfficetelCmTradeRentOfficetel;
      'api::cm-trade-rent-oneroom.cm-trade-rent-oneroom': ApiCmTradeRentOneroomCmTradeRentOneroom;
      'api::cm-trade-rent-villa.cm-trade-rent-villa': ApiCmTradeRentVillaCmTradeRentVilla;
      'api::cm-trade-resale-apt.cm-trade-resale-apt': ApiCmTradeResaleAptCmTradeResaleApt;
      'api::cm-trade-sales-apt.cm-trade-sales-apt': ApiCmTradeSalesAptCmTradeSalesApt;
      'api::cm-trade-sales-factory.cm-trade-sales-factory': ApiCmTradeSalesFactoryCmTradeSalesFactory;
      'api::cm-trade-sales-land.cm-trade-sales-land': ApiCmTradeSalesLandCmTradeSalesLand;
      'api::cm-trade-sales-officetel.cm-trade-sales-officetel': ApiCmTradeSalesOfficetelCmTradeSalesOfficetel;
      'api::cm-trade-sales-oneroom.cm-trade-sales-oneroom': ApiCmTradeSalesOneroomCmTradeSalesOneroom;
      'api::cm-trade-sales-store.cm-trade-sales-store': ApiCmTradeSalesStoreCmTradeSalesStore;
      'api::cm-trade-sales-villa.cm-trade-sales-villa': ApiCmTradeSalesVillaCmTradeSalesVilla;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::review-workflows.workflow': PluginReviewWorkflowsWorkflow;
      'plugin::review-workflows.workflow-stage': PluginReviewWorkflowsWorkflowStage;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
