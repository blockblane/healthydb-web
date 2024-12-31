import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh the session and get an up-to-date session
  await supabase.auth.getSession()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Auth condition
  if (session) {
    // If the user is signed in and the current path is /, redirect to /dashboard
    if (req.nextUrl.pathname === '/') {
      const redirectUrl = new URL('/dashboard', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  } else {
    // If the user is not signed in and the current path starts with /dashboard, redirect to /
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      const redirectUrl = new URL('/', req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/', '/dashboard/:path*']
}
