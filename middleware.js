// middleware.js (Node.js runtime)
import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';
import { prisma } from './lib/prisma';
import { cookies } from 'next/headers';

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  console.log(`[Middleware] Incoming request: ${pathname}`);

  // -------------------------------
  // 1️⃣ Admin Routes
  // -------------------------------
  if (pathname.startsWith('/admin')) {
    console.log('[Middleware] Admin route detected');

    // /admin is public
    if (pathname === '/admin') {
      console.log('[Middleware] /admin is public, allowing access');
      return NextResponse.next();
    }

    // Public admin APIs (e.g., login)
    const publicAdminAPIs = ['/admin/api/auth/login', '/admin/api/auth/register'];
    if (publicAdminAPIs.includes(pathname)) {
      console.log('[Middleware] Public admin API, allowing access:', pathname);
      return NextResponse.next();
    }

    // /admin/api or /admin/:path protected
    const c = await cookies();
    const token = c.get('adminToken')?.value;
    if (!token) {
  return NextResponse.redirect(new URL('/admin', req.url));
}

    console.log('[Middleware] Admin token received:');

    const adminSession = await prisma.admin_session.findFirst({
      where: {
        token,
        is_expired: false,
        token_expiry: { gt: new Date() },
      },
    });

  if (!adminSession) {
    return NextResponse.redirect(new URL('/admin', req.url));
  }

    console.log(`[Middleware] Admin session valid for admin_id: ${adminSession.admin_id}`);
    return NextResponse.next();
  }

  // -------------------------------
  // 2️⃣ Customer / My Account Routes
  // -------------------------------
if (pathname.startsWith('/my-account')) {
  const isCustomerAPI = pathname.startsWith('/my-account/api');
 const c = await cookies();
    const token = c.get('authToken')?.value;

  console.log('[Middleware][Customer] Route:', pathname);
  console.log('[Middleware][Customer] Is API:', isCustomerAPI);

  // 1️⃣ Token missing
  if (!token) {
    console.warn('[Middleware][Customer] ❌ Token missing');

    if (isCustomerAPI) {
      console.warn('[Middleware][Customer] Returning 401 for API');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.warn('[Middleware][Customer] Redirecting to /api/auth/logout');
  return NextResponse.redirect(
  new URL('/api/auth/logout', req.url),
  303
);
  }

  console.log('[Middleware][Customer] ✅ Token received');

  // 2️⃣ Verify JWT
  let decoded;
  try {
    decoded = verifyToken(token);
    console.log('[Middleware][Customer] ✅ JWT verified', {
      customerId: decoded.id,
    });
  } catch (err) {
    console.error('[Middleware][Customer] ❌ JWT verification failed:', err.message);

    if (isCustomerAPI) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.redirect(new URL('/api/auth/logout', req.url));
  }

  // 3️⃣ Check DB session
  console.log('[Middleware][Customer] 🔍 Checking customer_session in DB');

  const customerSession = await prisma.customer_session.findFirst({
    where: {
      customer_list_id: decoded.id,
      token,
      is_expired: false,
      token_expiry: { gt: new Date() },
    },
  });

  if (!customerSession) {
    console.warn(
      '[Middleware][Customer] ❌ Session invalid or expired for customer:',
      decoded.id
    );

    if (isCustomerAPI) {
      return NextResponse.json(
        { error: 'Session expired or invalid' },
        { status: 401 }
      );
    }

    console.warn('[Middleware][Customer] Redirecting to /api/auth/logout');
    return NextResponse.redirect(new URL('/api/auth/logout', req.url));
  }

  console.log(
    '[Middleware][Customer] ✅ Session valid for customer:',
    customerSession.customer_list_id
  );

  // ✅ Authenticated
  return NextResponse.next();
}


  // -------------------------------
  // 3️⃣ All other routes public
  // -------------------------------
  console.log('[Middleware] Public route, allowing access');
  return NextResponse.next();
}

// Node.js runtime so Prisma works
export const config = {
  matcher: ['/admin/:path*', '/my-account/:path*', '/admin', '/my-account'],
  runtime: 'nodejs',
};
