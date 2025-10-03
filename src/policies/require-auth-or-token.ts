// path: src/policies/require-auth-or-token.ts
// 타입 임포트 없이 심플하게

export default async (ctx, next) => {
  // 1) 직원 JWT (NextAuth 등에서 전달되는 Bearer)
  const hasJWT = !!ctx.state.user;

  // 2) Readonly API Key
  const readonly = process.env.STRAPI_REST_READONLY_API_KEY;
  const apiKey =
    ctx.request.header["x-strapi-readonly"] ||
    ctx.request.header["x-readonly-key"];

  if (!hasJWT && (!readonly || apiKey !== readonly)) {
    return ctx.unauthorized("Forbidden");
  }

  await next();
};
