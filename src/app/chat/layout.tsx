import React from 'react'
import { ChatSidebar } from '@shared/components'

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className='flex h-screen w-full overflow-hidden bg-white'>
      {/* 🌟 ฝั่งซ้าย: Sidebar (จองพื้นที่ไว้ก่อน) */}
      <div className='hidden w-64 flex-col border-r bg-gray-50 md:flex'>
        <ChatSidebar />
      </div>

      {/* 🌟 ฝั่งขวา: พื้นที่แชต (children จะเปลี่ยนไปตาม URL) */}
      <main className='relative flex min-w-0 flex-1 flex-col'>{children}</main>
    </div>
  )
}
