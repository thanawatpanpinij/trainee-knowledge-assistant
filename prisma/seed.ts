import { PrismaClient } from '../generated/prisma/client'
import bcrypt from 'bcryptjs'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const databaseURL = process.env['DATABASE_URL']
if (!databaseURL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const adapter = new PrismaLibSql({ url: databaseURL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('⏳ Seeding database...')

  const hashedPassword = await bcrypt.hash('admin123', 10)

  const user = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
    },
  })

  console.log(`✅ Mock user created successfully: ${user.username}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
