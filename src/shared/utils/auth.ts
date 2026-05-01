import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { ENV } from '@shared/config'

type AuthContext = {
  userId: string
  [key: string]: unknown
}

type AuthenticatedHandler = (
  req: NextRequest,
  context: AuthContext
) => Promise<Response>

export type AuthResult = { authenticated: true } | { authenticated: false }

export function getJwtSecretKey() {
  return new TextEncoder().encode(ENV.AUTH_SECRET)
}

export async function getAuthResult(request: NextRequest): Promise<AuthResult> {
  const token = request.cookies.get('auth_token')?.value
  if (!token) {
    return { authenticated: false }
  }

  try {
    await jwtVerify(token, getJwtSecretKey())
    return { authenticated: true }
  } catch (error) {
    console.error('Proxy auth failed:', error)
    return { authenticated: false }
  }
}

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context: Record<string, unknown>) => {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth_token')?.value
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { payload } = await jwtVerify(token, getJwtSecretKey())
      const userId = payload['userId'] as string

      if (!userId) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 })
      }

      return handler(req, { ...context, userId })
    } catch (error) {
      console.error('[Auth Wrapper Error]:', error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
}
