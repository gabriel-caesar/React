import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login', // user will be redirected to this address if not authenticated
  },
  callbacks: {
    // in conjunction with middleware.ts, this function will give the
    // user authorization to access the "locked by log in" routes
    authorized({ auth, request: { nextUrl } }) {

      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page

      } else if (isLoggedIn) {

        return Response.redirect(new URL('/dashboard', nextUrl));

      }
      return true;
    },
  },
  providers: []
} satisfies NextAuthConfig;