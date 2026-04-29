'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface ChatItem {
  id: string
  title?: string
  updatedAt: string
}

export default function ChatSidebar() {
  const [chats, setChats] = useState<ChatItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  // ดึง chatId ปัจจุบันจาก URL เพื่อทำแถบ Active สีเข้มๆ ให้รู้ว่าอยู่ห้องไหน
  const currentChatId = params?.['chatId'] as string

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('/api/chat') // เรียก API ที่คุณเพิ่งทำไว้
        if (res.ok) {
          const data = await res.json()
          setChats(data.chats || [])
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchChats()
  }, [currentChatId]) // ให้โหลดใหม่ถ้ามีการสลับห้อง (เพื่ออัปเดตแชตล่าสุด)

  return (
    <div className='flex h-full flex-col'>
      {/* ปุ่มสร้างแชตใหม่ */}
      <div className='p-4'>
        <Link
          href='/chat'
          className='flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700'
        >
          <svg className='h-5 w-5' viewBox='0 0 20 20' fill='currentColor'>
            <path
              fillRule='evenodd'
              d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
              clipRule='evenodd'
            />
          </svg>
          แชตใหม่
        </Link>
      </div>

      {/* รายชื่อแชต */}
      <div className='flex-1 overflow-y-auto px-2 pb-4'>
        <h2 className='mb-2 px-2 text-xs font-semibold text-gray-500'>
          ประวัติการสนทนา
        </h2>
        {isLoading ? (
          <div className='px-2 text-sm text-gray-400'>กำลังโหลด...</div>
        ) : chats.length === 0 ? (
          <div className='px-2 text-sm text-gray-400'>
            ยังไม่มีประวัติการแชต
          </div>
        ) : (
          <div className='space-y-1'>
            {chats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-gray-200 font-medium text-gray-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className='truncate'>
                  {/* ถ้ามี title ให้แสดง ถ้าไม่มีให้โชว์เป็น 'แชตใหม่' */}
                  {chat.title || 'แชตใหม่'}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
