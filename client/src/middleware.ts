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
  '/',
]

export default async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  console.warn('🔒 [Middleware] Checking path:', path)

  const isProtected = PROTECTED_PATHS.some(p => path.startsWith(p))
  const shouldBypass = BYPASS_PATHS.some(p => path === p || path.startsWith(`${p}/`))

  // Allow public paths or non-protected ones
  if (!isProtected || shouldBypass) {
    return NextResponse.next()
  }

  const sessionCookie = getSessionCookie(request)
  console.log('🍪 [Middleware] Session cookie:', sessionCookie)

  // For protected paths, check session
  try {
    if (!sessionCookie) {
      console.warn('⚠️ [Middleware] Not authenticated. Redirecting.')
      return NextResponse.redirect(new URL('/signin', request.url))
    }

    console.log('✅ [Middleware] Authenticated user:')
    return NextResponse.next()
  } catch (err) {
    console.error('🔥 [Middleware] Error in auth check:', err)
    return NextResponse.redirect(new URL('/signin', request.url))
  }
}

// Only apply to protected paths
export const config = {
  matcher: [
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