import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token }) => token?.role === 'ADMIN',
  },
  pages: {
    signIn: '/dashboard/login',
  },
});

export const config = { matcher: ['/dashboard/:path*'] };
