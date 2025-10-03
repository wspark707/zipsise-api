// path: src/policies/require-auth-or-token.ts
import { Strapi } from '@strapi/strapi';

export default async (ctx, next) => {
  // 1) Bearer JWT (직원 계정으로 로그인한 토큰)
  const hasJWT = !!ctx.state.user;

  // 2) 또는 Readonly API Token
  const readonly = process.env.STRAPI_REST_READONLY_API_KEY;
  const apiKey = ctx.request.header['x-strapi-readonly'] || ctx.request.header['x-readonly-key'];

  if (!hasJWT && (!readonly || apiKey !== readonly)) {
    return ctx.unauthorized('Forbidden');
  }
  await next();
};
