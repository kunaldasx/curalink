import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check role-based access
    if (path.startsWith('/patient') && token?.role !== 'patient') {
      return NextResponse.redirect(new URL('/researcher/dashboard', req.url));
    }

    if (path.startsWith('/researcher') && token?.role !== 'researcher') {
      return NextResponse.redirect(new URL('/patient/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/patient/:path*', '/researcher/:path*'],
};
