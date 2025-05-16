import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authClient } from '@/lib/auth-client'
import { getSessionCookie } from 'better-auth/cookies'

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/daily-log',
  '/goals',
  '/journal',
  '/ai-insights',
  '/profile',
  '/settings',
]

// Public or static paths that should bypass auth
const BYPASS_PATHS = [
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/signin',
  '/signup',
]

// Auth-only redirect paths
const AUTH_REDIRECT_PATHS = [
  '/',
]

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.warn('🔒 [Middleware] Checking path:', path)

  const isProtected = PROTECTED_PATHS.some(p => path.startsWith(p))
  const shouldBypass = BYPASS_PATHS.some(p => path === p || path.startsWith(`${p}/`))
  const shouldRedirectIfAuth = AUTH_REDIRECT_PATHS.some(p => path === p)

  //const sessionCookie = getSessionCookie(request)
  const cookieName = process.env.NODE_ENV === 'production'
  ? '__Secure-better-auth.session_token'
  : 'better-auth.session_token';
  const sessionCookie = request.cookies.get(cookieName)?.value;
  
  console.warn('All cookies:', JSON.stringify(request.cookies.getAll()));
  console.warn('Session cookie found:', !!sessionCookie);
  console.warn('Session cookie value:', sessionCookie);

  try {
    // Handle landing page redirect for authenticated users
    if (shouldRedirectIfAuth && sessionCookie) {
      console.warn('👤 [Middleware] Authenticated user on landing page, redirecting to dashboard')
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow public paths or non-protected ones
    if (!isProtected || shouldBypass) {
      console.warn(`[Middleware] Allowing access to ${path} (public or bypassed path)`)
      return NextResponse.next()
    }

    // For protected paths, check session
    if (!sessionCookie) {
      console.warn(`⚠️ [Middleware] Not authenticated for protected path: ${path}. Redirecting.`)
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    console.warn(`✅ [Middleware] Authenticated user accessing: ${path}`)
    return NextResponse.next()
  } catch (err) {
    console.error('🔥 [Middleware] Error in auth check:', err)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/daily-log/:path*',
    '/goals/:path*',
    '/journal/:path*',
    '/ai-insights/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}
