// path: src/api/meta/controllers/meta.ts
// 타입 임포트 필요 없음

export default {
  async contentTypes(ctx) {
    const { strapi } = ctx;

    const cts = Object.values(strapi.contentTypes || {}).filter(
      (ct: any) => ct?.kind === "collectionType"
    );

    const data = cts.map((ct: any) => {
      const attrs: Record<string, any> = {};
      for (const [name, a] of Object.entries<any>(ct.attributes ?? {})) {
        const base: any = { type: a.type };
        if (a.required) base.required = true;
        if (Array.isArray(a.enum)) base.enum = a.enum;
        if (a.relation) {
          base.relation = a.relation; // oneToOne/oneToMany/manyToOne/manyToMany
          base.target = a.target;     // 'api::xxx.yyy'
          if (a.inversedBy) base.inversedBy = a.inversedBy;
          if (a.mappedBy) base.mappedBy = a.mappedBy;
        }
        if (a.components) base.components = a.components;
        if (a.multiple) base.multiple = true;
        attrs[name] = base;
      }

      return {
        uid: ct.uid,                       // e.g. "api::brand.brand"
        apiName: ct.apiName,               // e.g. "brand"
        info: ct.info,                     // { displayName, description }
        collectionName: ct.collectionName, // table
        attributes: attrs,
      };
    });

    ctx.body = { data };
  },
};
