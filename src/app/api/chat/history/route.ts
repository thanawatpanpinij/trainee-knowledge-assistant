// src/app/api/chat/history/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@shared/utils/authWrapper'
import { ChatService } from '@/services/chat.service'

export const GET = withAuth(async (req: NextRequest, { userId }) => {
  try {
    const { searchParams } = new URL(req.url)
    const chatId = searchParams.get('chatId')

    if (!chatId) {
      return NextResponse.json({ messages: [] })
    }

    const messages = await ChatService.getChatHistory(chatId, userId)

    if (!messages) {
      return NextResponse.json(
        { error: 'ไม่พบห้องแชทนี้ หรือคุณไม่มีสิทธิ์เข้าถึง' },
        { status: 403 }
      )
    }

    return NextResponse.json({ messages })
  } catch (error: unknown) {
    console.error('[Load History API Error]:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการดึงประวัติแชท' },
      { status: 500 }
    )
  }
})
