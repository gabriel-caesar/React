import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login', // user will be redirected to this address if not authenticated
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      console.log(`\n IS LOGGED IN? ${isLoggedIn} \n`)
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      console.log(`\n IS ON DASHBOARD? ${isOnDashboard} \n`)
      if (isOnDashboard) {
        console.log(`\n IF WHILE ON DASHBOARD ${isOnDashboard}, ARE YOU LOGGED IN? ${isLoggedIn} \n`)
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        console.log(`\n ELSE IF IS ${isLoggedIn} SO REDIRECTING USER TO /dashboard \n`)
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
  providers: []
} satisfies NextAuthConfig;