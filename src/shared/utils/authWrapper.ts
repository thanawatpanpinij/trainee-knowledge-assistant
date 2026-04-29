import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { getJwtSecretKey } from '@shared/utils/jwt'

type AuthContext = {
  userId: string
  [key: string]: unknown
}
// กำหนด Type สำหรับ Function ที่ต้องการ UserId
type AuthenticatedHandler = (
  req: NextRequest,
  context: AuthContext
) => Promise<Response>

export async function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context: Record<string, unknown>) => {
    try {
      const cookieStore = await cookies()
      const token = cookieStore.get('auth_token')?.value
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      // แกะ JWT
      const secret = getJwtSecretKey()
      const { payload } = await jwtVerify(token, secret)

      const userId = payload['userId'] as string
      if (!userId) {
        return NextResponse.json({ error: 'Invalid Token' }, { status: 401 })
      }

      // ส่ง userId ต่อไปให้ handler จริงๆ
      return handler(req, { ...context, userId })
    } catch (error) {
      console.error('[Auth Wrapper Error]:', error)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
}
