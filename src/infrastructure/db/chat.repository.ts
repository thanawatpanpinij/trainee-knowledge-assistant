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

  async getMessagesByChatId(chatId: string, userId: string) {
    // 1. เช็กความปลอดภัยก่อนว่า Chat นี้เป็นของ User คนนี้จริงๆ
    const chat = await prisma.chat.findUnique({
      where: { id: chatId, userId },
    })

    if (!chat) return null

    // 2. ดึงข้อความทั้งหมดเรียงตามเวลาที่สร้าง
    return prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    })
  },

  // เพิ่มฟังก์ชันดึงรายชื่อแชต (เรียงจากใหม่ไปเก่า)
  async getUserChatList(userId: string) {
    return prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }, // แชตล่าสุดขึ้นก่อน
      select: {
        id: true,
        title: true,
        updatedAt: true,
      },
    })
  },
}
