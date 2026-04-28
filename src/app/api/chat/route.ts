import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { ENV } from '@/config/env'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { getJwtSecretKey } from '@utils/jwt'
import prisma from '@lib/db/prisma'
import { NextResponse } from 'next/server'

// ควบคุมการสร้าง Instance แบบ Explicit ผ่าน Zod Validation
const google = createGoogleGenerativeAI({
  apiKey: ENV['GOOGLE_GENERATIVE_AI_API_KEY'],
})

export async function POST(req: Request) {
  try {
    // 1. ยืนยันตัวตนและดึง userId จาก Cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // แกะ JWT เพื่อเอา userId
    const verified = await jwtVerify(token, getJwtSecretKey())
    const userId = verified.payload['userId'] as string

    // 2. รับข้อมูลข้อความ และ chatId จากหน้าบ้าน
    const { messages, chatId } = await req.json()

    // 3. จัดการห้องแชท (Chat Session)
    let currentChatId = chatId

    // ดึงข้อความล่าสุดที่ User เพิ่งพิมพ์มา
    const latestUserMessage: UIMessage = messages[messages.length - 1]
    const latestUserText =
      latestUserMessage.parts
        ?.filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('\n') || ''

    if (!currentChatId) {
      // ถ้ายังไม่มี chatId แปลว่าเป็นแชทใหม่ ให้สร้าง Chat record ก่อน
      // เอาข้อความแรกของ user มาตัดคำทำเป็น Title (ไม่เกิน 50 ตัวอักษร)
      const newChat = await prisma.chat.create({
        data: {
          userId,
          title: latestUserText.substring(0, 50) || 'New Chat',
        },
      })
      currentChatId = newChat.id
    }

    // 4. บันทึกข้อความของ User ลง Database
    await prisma.message.create({
      data: {
        chatId: currentChatId,
        role: 'user',
        content: latestUserText,
      },
    })

    // 5. เรียกใช้ Gemini และ Streaming
    const result = await streamText({
      model: google('gemini-2.5-flash-lite'),
      messages: await convertToModelMessages(messages),
      async onFinish({ text, usage }) {
        // 6. บันทึกคำตอบของ AI พร้อมกับ Token Usage ลง Database
        await prisma.message.create({
          data: {
            chatId: currentChatId,
            role: 'assistant',
            content: text,
            tokenUsage: usage.totalTokens, // 👈 เก็บจำนวน Token ตาม Requirement
          },
        })
      },
    })

    // 7. ส่ง Data Stream กลับไปให้ Client
    // ทริค: แนบ chatId กลับไปที่ Header ด้วย เพื่อให้หน้าบ้านรู้ว่ากำลังคุยอยู่ในห้องไหน
    const response = result.toUIMessageStreamResponse()
    response.headers.set('x-chat-id', currentChatId)

    return response
  } catch (error) {
    console.error('Error in Chat API:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
