import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
// import { authConfig } from './auth.config';
// import NextAuth from 'next-auth';
// import { NextFetchEvent, NextRequest } from 'next/server';
// import { auth } from './auth';

// proxy.ts for next-intl
export default createIntlMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|.*\\..*).*)'
}

// proxy.ts for next-auth
// export default NextAuth(authConfig).auth;

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// };



// try to merge the two middlewares but doesn't work. Wait until next-auth 5 becomes a stable version
// const intlMiddleware = createIntlMiddleware(routing);
// const authMiddleware = NextAuth(authConfig).auth;

// export default async function middleware(req: NextRequest, event: NextFetchEvent) {
//   // Run next-intl first (rewrites locale)
//   const intlResponse = intlMiddleware(req);

//   // If next-intl already returned a response (redirect/rewrite), return it
//   if (intlResponse) {
//     return intlResponse;
//   }

//   // Then run next-auth
//   return authMiddleware(req, event);
// }

// export const config = {
//   matcher: [
//     '/((?!api|_next|.*\\..*).*)', // next-intl
//     '/((?!api|_next/static|_next/image|.*\\.png$).*)' // next-auth
//   ]
// };
