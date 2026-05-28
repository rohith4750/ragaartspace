import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the login pages themselves (avoid redirect loops)
  if (pathname === '/admin/login' || pathname === '/login') {
    return NextResponse.next();
  }

  // Get the JWT token from the session cookie
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // --- Admin routes: require ADMIN role ---
  if (pathname.startsWith('/admin')) {
    if (!token || token.role !== 'ADMIN') {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // --- Dashboard routes: require ADMIN, MANAGER, or STAFF ---
  if (pathname.startsWith('/dashboard')) {
    const allowedRoles = ['ADMIN', 'MANAGER', 'STAFF'];
    if (!token || !allowedRoles.includes(token.role as string)) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/dashboard/:path*', '/dashboard'],
};
