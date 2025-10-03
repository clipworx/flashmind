// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl

  const isAuthPage = url.pathname.startsWith('/auth/login') || url.pathname.startsWith('/auth/register')

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/lists/:path*', '/api/decks/:path*', '/lists/:path*', '/decks/:path*', '/home', '/'] // protect these APIs
}
