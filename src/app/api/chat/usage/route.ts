import prisma from '@lib/db/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // 1. ดึง chatId จาก URL Query (เช่น /api/chat/usage?chatId=123)
  const { searchParams } = new URL(req.url)
  const chatId = searchParams.get('chatId')

  if (!chatId) {
    return NextResponse.json({ total: 0 })
  }

  try {
    // 2. สั่ง Prisma ให้หาผลรวมของ field tokenUsage เฉพาะใน chatId นี้
    const result = await prisma.message.aggregate({
      where: { chatId },
      _sum: { tokenUsage: true },
    })

    // 3. ส่งตัวเลขกลับไปให้หน้าบ้าน
    return NextResponse.json({ total: result._sum.tokenUsage || 0 })
  } catch (error) {
    console.error('[Token Usage API Error]:', error)
    return NextResponse.json({ total: 0 }, { status: 500 })
  }
}
