'use client'

import { SubmitEvent, useEffect, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [chatId, setChatId] = useState<string | null>(null)

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      fetch: async (url, options) => {
        const controller = new AbortController()
        let isTimeout = false

        const timeoutId = setTimeout(() => {
          isTimeout = true
          controller.abort()
        }, 15000)

        if (options?.signal) {
          options.signal.addEventListener('abort', () => controller.abort())
        }

        try {
          const response = await fetch(url, {
            ...options,
            signal: controller.signal,
          })
          // ดึงค่า x-chat-id จาก Header ที่ Backend ส่งมา
          const returnedChatId = response.headers.get('x-chat-id')
          // ถ้ามี ID ส่งกลับมา ให้เก็บลง State ทันที
          if (returnedChatId) {
            setChatId((prev) => prev || returnedChatId)
          }

          return response
        } catch (err) {
          if (isTimeout) {
            throw new Error('TimeoutError')
          }
          throw err
        } finally {
          clearTimeout(timeoutId)
        }
      },
    }),
  })

  const isLoading = status === 'submitted' || status === 'streaming'

  // ใช้สำหรับเลื่อนหน้าจอลงมาล่างสุดอัตโนมัติเวลาแชตยาวขึ้น
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    sendMessage({ text: input }, { body: { chatId } })
    setInput('')
  }

  return (
    <div className='mx-auto flex h-screen max-w-3xl flex-col bg-gray-50 p-4'>
      <header className='mb-4 border-b border-gray-200 py-4'>
        <h1 className='text-2xl font-bold text-gray-800'>
          Knowledge Assistant
        </h1>
      </header>

      {/* พื้นที่แสดงข้อความสนทนา */}
      <div className='flex-1 space-y-4 overflow-y-auto pr-4 pb-4'>
        {messages.length === 0 ? (
          <div className='mt-20 text-center text-gray-400'>
            พิมพ์ข้อความเพื่อเริ่มต้นคุยกับ AI ได้เลยครับ
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  m.role === 'user'
                    ? 'rounded-br-none bg-blue-600 text-white'
                    : 'rounded-bl-none border border-gray-200 bg-white text-gray-800 shadow-sm'
                }`}
              >
                <div className='mb-1 text-sm font-semibold opacity-75'>
                  {m.role === 'user' ? 'You' : 'AI'}
                </div>
                {/* ถ้ามี Bonus Markdown Rendering จะเอา ReactMarkdown มาครอบตรงนี้ทีหลังครับ */}
                <div className='leading-relaxed whitespace-pre-wrap'>
                  {m.parts &&
                    m.parts.length > 0 &&
                    m.parts.map((p) => {
                      if (p.type === 'text') {
                        return p.text
                      }
                      return null
                    })}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Loading Indicator แบบง่ายๆ */}
        {isLoading && (
          <div className='flex justify-start'>
            <div className='animate-pulse rounded-2xl rounded-bl-none bg-gray-200 px-4 py-3 text-gray-500'>
              AI กำลังพิมพ์...
            </div>
          </div>
        )}

        {/* 🚨 แสดง Error (รวมถึง Timeout) */}
        {error && error.message !== 'Failed to fetch' && (
          <div className='my-4 flex justify-center'>
            <div className='rounded-lg border border-red-200 bg-red-100 px-4 py-2 text-sm text-red-600'>
              {error.message === 'TimeoutError'
                ? 'การเชื่อมต่อขัดข้องหรือใช้เวลานานเกินไป (Timeout) กรุณาลองอีกครั้ง'
                : `เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง`}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ฟอร์มส่งข้อความ */}
      <form
        onSubmit={handleSubmit}
        className='relative mt-auto flex items-center'
      >
        <input
          className='w-full rounded-full border border-gray-300 bg-white p-4 pr-16 text-black shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none'
          value={input}
          placeholder='ถามอะไรมาได้เลย...'
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        {/* สลับปุ่ม Send และ Stop ตามสถานะ isLoading */}
        {isLoading ? (
          <button
            type='button'
            onClick={() => stop()}
            className='absolute right-2 rounded-full bg-red-500 p-2 text-white transition-colors hover:bg-red-600'
            title='หยุดการทำงาน'
          >
            {/* Icon Stop (สี่เหลี่ยม) */}
            <svg viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5'>
              <path
                fillRule='evenodd'
                d='M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z'
                clipRule='evenodd'
              />
            </svg>
          </button>
        ) : (
          <button
            type='submit'
            disabled={!input.trim()}
            className='absolute right-2 rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:bg-gray-300'
          >
            {/* Icon Send (จรวด/ลูกศร) */}
            <svg viewBox='0 0 24 24' fill='currentColor' className='h-5 w-5'>
              <path d='M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z' />
            </svg>
          </button>
        )}
      </form>
    </div>
  )
}
