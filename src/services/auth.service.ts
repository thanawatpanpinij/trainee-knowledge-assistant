import { SignJWT } from 'jose'
import bcrypt from 'bcryptjs'
import prisma from '@lib/db/prisma'
import { getJwtSecretKey } from '@shared/utils/jwt'

export const authService = {
  async verifyCredentials(username: string, password: string) {
    const user = await prisma.user.findUnique({ where: { username } })
    if (!user) return null

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return null

    return user
  },

  async generateToken(userId: string, username: string) {
    const token = await new SignJWT({ userId, username })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(getJwtSecretKey())

    return token
  },
}
