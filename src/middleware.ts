// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

const JWT_SECRET = process.env.JWT_SECRET!

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl

  const isAuthPage = url.pathname.startsWith('/auth/login') || url.pathname.startsWith('/auth/register')
  try {
    // Token exists and user tries to access login/register → redirect to dashboard
    if (token) {
      const payload = await verifyToken(token)
      if (payload && isAuthPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      if (!payload && !isAuthPage) {
        // Invalid token, redirect to login
        return NextResponse.redirect(new URL('/auth/login', req.url))
      }

      return NextResponse.next()
    }

    // No token and user is trying to access a protected page → redirect to login
    if (!token && !isAuthPage) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

  // No token but accessing login/register → allow
  return NextResponse.next()
  } catch (err) {
    console.error('Token verification failed:', err)
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }
}

// Protect specific routes
export const config = {
  matcher: ['/api/lists/:path*', '/api/decks/:path*', '/lists/:path*', '/decks/:path*', '/home'] // protect these APIs
}
