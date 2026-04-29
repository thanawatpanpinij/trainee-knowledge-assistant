import prisma from './prisma'

export const ChatRepository = {
  // สร้างห้องแชทใหม่
  async createChat(userId: string, title: string) {
    return await prisma.chat.create({
      data: { userId, title: title.substring(0, 50) || 'New Chat' },
    })
  },

  // บันทึกข้อความลง Database
  async saveMessage(
    chatId: string,
    role: 'user' | 'assistant',
    content: string,
    tokenUsage?: number
  ) {
    return await prisma.message.create({
      data: {
        chatId,
        role,
        content,
        tokenUsage,
      },
    })
  },
}
