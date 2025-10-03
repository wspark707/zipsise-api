// path: src/api/meta/controllers/meta.ts
import { factories } from '@strapi/strapi';

type Attr = {
  type: string;
  required?: boolean;
  enum?: string[];
  multiple?: boolean;
  relation?: string; // 'oneToOne', 'oneToMany', ...
  target?: string;   // 'api::brand.brand'
  components?: string[];
};

export default factories.createCoreController('api::meta.meta', ({ strapi }) => ({
  async contentTypes(ctx) {
    // 모든 collectionType만 추출 (singleType 제외)
    const cts = Object.values(strapi.contentTypes)
      .filter((ct: any) => ct.kind === 'collectionType')
      .map((ct: any) => {
        const attrs: Record<string, Attr> = {};
        for (const [name, a] of Object.entries<any>(ct.attributes ?? {})) {
          const base: Attr = { type: a.type };
          if (a.required) base.required = true;
          if (Array.isArray(a.enum)) base.enum = a.enum;
          if (a.relation) {
            base.relation = a.relation;
            base.target = a.target;
          }
          if (a.components) base.components = a.components;
          if (a.multiple) base.multiple = true;
          attrs[name] = base;
        }
        return {
          uid: ct.uid,                       // e.g. "api::brand.brand"
          apiName: ct.apiName,               // e.g. "brand"
          info: ct.info,                     // { displayName, description }
          collectionName: ct.collectionName, // table name
          attributes: attrs,
        };
      });

    ctx.body = { data: cts };
  },
}));
