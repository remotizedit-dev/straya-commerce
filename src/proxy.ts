import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const pathname = request.nextUrl.pathname;

  // 1. Detect if request originates from an authorized CMS subdomain or local dev environment
  const isCMSSubdomain =
    hostname.startsWith('cms.') ||
    hostname.startsWith('cms-') ||
    hostname.includes('cms-domain.com') ||
    hostname.includes('cms.domain.com');

  // 2. On CMS subdomains (cms.domain.com or cms-domain.com), serve the CMS on root "/"
  if (isCMSSubdomain && pathname === '/') {
    return NextResponse.rewrite(new URL('/cms', request.url));
  }

  // 3. STRICT SECURITY RULE: TURN OFF /cms AND /admin ON THE MAIN DOMAIN (domain.com or www.domain.com)
  // Any attempt to type domain.com/cms or domain.com/admin is instantly blocked and redirected to home "/"
  if (!isCMSSubdomain && !hostname.includes('localhost') && (pathname.startsWith('/cms') || pathname.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
