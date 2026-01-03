import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const pathname = nextUrl.pathname;
      const locale = pathname.split('/')[1];
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = pathname.startsWith(`/${locale}/dashboard`);

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL(`/${locale}/dashboard`, nextUrl));
      }
      return true;
    }
  },
  providers: []
} satisfies NextAuthConfig;
