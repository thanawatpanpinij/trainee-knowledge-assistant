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
export const maxDuration = 15

export async function POST(req: Request) {
  try {
    // 🚨 1. ดึง signal ออกมาจาก Request ทันที เพื่อเอาไว้เช็กสถานะการเชื่อมต่อ
    const signal = req.signal

    // 2. ยืนยันตัวตนและดึง userId จาก Cookie
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // แกะ JWT เพื่อเอา userId
    const verified = await jwtVerify(token, getJwtSecretKey())
    const userId = verified.payload['userId'] as string

    // 3. รับข้อมูลข้อความ และ chatId จากหน้าบ้าน
    const { messages, chatId, fileContext } = await req.json()

    // 4. จัดการห้องแชท (Chat Session)
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

    // 🚨 6. ตรวจสอบว่า Client ตัดสายไปหรือยัง ก่อนที่จะส่ง Request ไปกวนใจ AI
    if (signal.aborted) {
      console.log('🚫 Client ตัดการเชื่อมต่อไปแล้ว ยกเลิกการเรียก AI!')
      // โยน Error ออกไปเพื่อให้เข้าบล็อก catch และหยุดการทำงานทันที
      throw new Error('Client aborted the request')
    }

    // 7. เรียกใช้ Gemini และ Streaming
    const result = await streamText({
      model: google('gemini-2.5-flash-lite'),
      messages: await convertToModelMessages(messages),
      abortSignal: signal,
      async onFinish({ text, usage }) {
        // 8. บันทึกคำตอบของ AI พร้อมกับ Token Usage ลง Database
        await prisma.message.create({
          data: {
            chatId: currentChatId,
            role: 'assistant',
            content: text,
            tokenUsage: usage.totalTokens, // 👈 เก็บจำนวน Token ตาม Requirement
          },
        })
      },
      ...(fileContext && {
        system: `นี่คือข้อมูลอ้างอิงจากเอกสารที่ผู้ใช้อัปโหลดมา:\n\n${fileContext}\n\nกรุณาใช้ข้อมูลเหล่านี้ประกอบการตอบคำถาม หากคำถามไม่เกี่ยวกับเนื้อหานี้ ให้ตอบตามความรู้ปกติของคุณ`,
      }),
    })

    // 9. ส่ง Data Stream กลับไปให้ Client
    // ทริค: แนบ chatId กลับไปที่ Header ด้วย เพื่อให้หน้าบ้านรู้ว่ากำลังคุยอยู่ในห้องไหน
    const response = result.toUIMessageStreamResponse()
    response.headers.set('x-chat-id', currentChatId)
    return response
  } catch (error: unknown) {
    // 🚨 10. ดักจับ Error ที่เกิดจากการ Abort โดยเฉพาะ เพื่อไม่ให้รก Console ด้วย Error 500
    if (error instanceof Error) {
      if (
        error.message === 'Client aborted the request' ||
        error.name === 'AbortError'
      ) {
        console.log('✅ หยุดการทำงานของ Server สำเร็จอย่างปลอดภัย')
        // Status 499 คือ Client Closed Request (ผู้ใช้ปิดการเชื่อมต่อ)
        return new NextResponse('Client Closed Request', { status: 499 })
      }
    }

    console.error('Error', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
