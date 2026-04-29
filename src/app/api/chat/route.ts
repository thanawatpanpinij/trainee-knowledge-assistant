import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@shared/utils/authWrapper'
import { ChatService } from '@services/chat.service'
import { AIService } from '@services/ai.service'
import { chatRequestSchema } from '@shared/validations'
import { ChatRepository } from '@lib/db/chat.repository'

export const maxDuration = 15

export const GET = withAuth(async (_req: NextRequest, { userId }) => {
  try {
    const chats = await ChatRepository.getUserChatList(userId)
    return NextResponse.json({ chats })
  } catch (error: unknown) {
    console.error('[Chat List API Error]:', error)
    return NextResponse.json(
      { error: 'ไม่สามารถโหลดรายชื่อแชตได้' },
      { status: 500 }
    )
  }
})

export const POST = withAuth(async (req: NextRequest, { userId }) => {
  try {
    // 1. Validate ข้อมูลด้วย Zod (Runtime Safety)
    const json = await req.json()
    const { messages, chatId, fileContext } = chatRequestSchema.parse(json)

    // 2. Business Logic: จัดการห้องแชทและบันทึกข้อความ User
    // แยกความซับซ้อนไปไว้ที่ ChatService ทั้งหมด
    const currentChatId = await ChatService.ensureChatAndSaveMessage({
      userId,
      messages,
      chatId,
    })

    // 3. AI Logic: เรียก Gemini Streaming
    // แยก AI logic ไปไว้ที่ AIService
    const result = await AIService.chatStream({
      messages,
      chatId,
      fileContext,
      abortSignal: req.signal,
    })

    // 4. Return Response พร้อมแนบ chatId กลับไปที่ Header
    const response = result.toUIMessageStreamResponse()
    response.headers.set('x-chat-id', currentChatId)

    return response
  } catch (error: unknown) {
    // ดักจับ Zod Error หรือ Error อื่นๆ แบบรวมศูนย์
    console.error('[Chat API Error]:', error)

    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในระบบ โปรดลองใหม่อีกครั้ง' },
      { status: 500 }
    )
  }
})
