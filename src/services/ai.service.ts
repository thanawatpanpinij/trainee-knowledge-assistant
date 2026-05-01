import { ChatRequest } from '@shared/validations'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { ENV } from '@shared/config'
import { ChatRepository } from '@infrastructure/db/chat.repository'
import { streamText, convertToModelMessages, UIMessage } from 'ai'

const google = createGoogleGenerativeAI({
  apiKey: ENV['GOOGLE_GENERATIVE_AI_API_KEY'],
})

interface chatStreamParams {
  messages: UIMessage[]
  chatId?: ChatRequest['chatId']
  fileContext?: ChatRequest['fileContext']
  abortSignal?: AbortSignal
}

export const AIService = {
  async chatStream({
    messages,
    chatId,
    fileContext,
    abortSignal,
  }: chatStreamParams) {
    const modelMessages = await convertToModelMessages(messages)

    return await streamText({
      model: google('gemini-2.5-flash-lite'),
      messages: modelMessages,
      abortSignal,
      ...(fileContext && {
        system: `นี่คือข้อมูลอ้างอิงจากเอกสารที่ผู้ใช้อัปโหลดมา:\n\n${fileContext}\n\nกรุณาใช้ข้อมูลเหล่านี้ประกอบการตอบคำถาม หากคำถามไม่เกี่ยวกับเนื้อหานี้ ให้ตอบตามความรู้ปกติของคุณ`,
      }),
      onFinish: async ({ text, usage }) => {
        if (chatId) {
          try {
            await ChatRepository.saveMessage(
              chatId,
              'assistant',
              text,
              usage.totalTokens
            )
            console.log(
              `✅ บันทึก Token: ${usage.totalTokens} ลง chatId: ${chatId}`
            )
          } catch (error) {
            console.error('❌ ไม่สามารถบันทึกข้อความ/Token ของ AI ได้:', error)
          }
        }
      },
    })
  },
}
