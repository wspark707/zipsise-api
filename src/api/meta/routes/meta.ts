// path: src/api/meta/routes/meta.ts
import { factories } from '@strapi/strapi';

export default {
  routes: [
    {
      method: 'GET',
      path: '/meta/content-types',
      handler: 'meta.contentTypes',
      config: {
        // 사내 인트라넷만 접근: API Token 또는 JWT 필요
        policies: ['global::require-auth-or-token'],
      },
    },
  ],
} as const;
