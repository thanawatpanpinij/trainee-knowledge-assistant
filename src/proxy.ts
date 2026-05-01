import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuthResult } from '@shared/utils/auth'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const auth = await getAuthResult(request)
  const loginUrl = new URL('/login', request.url)

  if (!auth.authenticated) {
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/chat', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/chat/:path*', '/upload/:path*'],
}
