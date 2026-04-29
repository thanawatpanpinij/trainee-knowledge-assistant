import { ChatRequest } from '../shared/validations/chatSchema'
import { ChatRepository } from '@lib/db/chat.repository'
import { UIMessage } from 'ai'

interface ensureChatAndSaveMessageParam {
  userId: string
  messages: UIMessage[]
  chatId?: ChatRequest['chatId']
}

export const ChatService = {
  async ensureChatAndSaveMessage({
    userId,
    messages,
    chatId,
  }: ensureChatAndSaveMessageParam) {
    let currentChatId = chatId

    // 1. ดึงข้อความล่าสุดจาก User (ดึงจาก parts ตามที่คุณวางโครงสร้างไว้)
    const latestUserMessage = messages[messages.length - 1]
    const latestUserText =
      latestUserMessage?.parts
        .filter((p) => p.type === 'text')
        .map((p) => p.text)
        .join('\n') || ''

    // 2. ถ้าไม่มี chatId (แชทใหม่) ให้สร้างห้องแชทก่อน
    if (!currentChatId) {
      const newChat = await ChatRepository.createChat(userId, latestUserText)
      currentChatId = newChat.id
    }

    // 3. บันทึกข้อความของ User ลง Database ผ่าน Repository
    await ChatRepository.saveMessage(currentChatId, 'user', latestUserText)

    return currentChatId
  },
}
