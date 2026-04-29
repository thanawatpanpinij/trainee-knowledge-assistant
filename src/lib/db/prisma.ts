import { ENV } from '@shared/config'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { PrismaClient } from 'generated/prisma/client'

const globalForPrisma = global as unknown as {
  prisma: PrismaClient
}

const adapter = new PrismaLibSql({
  url: ENV['DATABASE_URL'],
})

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  })
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
