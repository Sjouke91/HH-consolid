import { NextRequest, NextResponse } from 'next/server';
import { localization } from './config';

export function middleware(request: NextRequest) {
  let { pathname, search } = request.nextUrl;

  if (!pathname || pathname === 'undefined' || pathname === '/undefined') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (pathname.includes('vacancies') || pathname.includes('application')) {
    pathname = pathname.replace(/(\/vacancies\/)(.*_)(.*)/g, '$1$3');
  }
  return NextResponse.rewrite(new URL(`${pathname}${search}`, request.url));
}

export const config = {
  matcher: [
    // Match all paths except those that start with /_next, /api, favicon.ico
    // and all files that end with: .txt .pdf .xml .svg
    '/((?!_next|api|_next/static|_next/image|favicon.ico|.*.txt$|.*.pdf$|.*.xml$|.*.svg$).*)',
  ],
};
