import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  const user = await getUserFromToken(token)
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const proxyConfig = {
  matcher: [
    '/dashboard/:path*',
    '/produkte/:path*',
    '/kunden/:path*',
    '/rechnungen/:path*',
    '/einstellungen/:path*',
    '/api/:path*'
  ]
}