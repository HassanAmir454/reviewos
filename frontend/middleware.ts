import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default auth((req: NextRequest & { auth: any }) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Protect all dashboard routes
  if (pathname.startsWith('/dashboard') && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect logged-in users away from login page
  if (pathname === '/login' && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard/prs', req.url))
  }
})

export const config = {
  // Run on all routes except static assets and NextAuth API routes
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/auth).*)'],
}
