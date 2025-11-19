import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: '/login',
    },
  }
);

// Halaman yang perlu proteksi (semua kecuali login dan register)
export const config = {
  matcher: [
    '/',
    '/kas-harian/:path*',
    '/zakat-fitrah/:path*',
    '/zakat-mal/:path*',
    '/mustahiq/:path*',
    '/pengeluaran/:path*',
    '/laporan/:path*',
    '/reset/:path*',
  ],
};
