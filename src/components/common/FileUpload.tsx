'use client'

import React, { useRef, useState } from 'react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

const MAX_FILE_SIZE_MB = 5
const ALLOWED_TYPES = ['application/pdf', 'text/plain']

export default function FileUpload({
  onFileSelect,
  disabled,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null)
    const file = e.target.files?.[0]

    if (!file) return

    // 1. Validate Type (PDF, TXT เท่านั้น)
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErrorMsg('รองรับเฉพาะไฟล์ PDF และ TXT เท่านั้นครับ')
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // 2. Validate Size (ไม่เกิน 5MB)
    const fileSizeMB = file.size / (1024 * 1024)
    if (fileSizeMB > MAX_FILE_SIZE_MB) {
      setErrorMsg(
        `ขนาดไฟล์ต้องไม่เกิน ${MAX_FILE_SIZE_MB}MB (ไฟล์นี้ขนาด ${fileSizeMB.toFixed(2)}MB)`
      )
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    // ถ้าผ่านหมด ให้ส่งไฟล์ออกไปให้ Parent Component จัดการต่อ
    onFileSelect(file)
  }

  return (
    <div className='relative flex flex-col items-start'>
      <input
        type='file'
        ref={fileInputRef}
        onChange={handleFileChange}
        accept='.pdf,.txt'
        className='hidden' // ซ่อน input จริงไว้
        disabled={disabled}
      />

      {/* ปุ่ม UI ที่ผู้ใช้จะกด */}
      <button
        type='button'
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className='flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400'
      >
        <svg
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='h-5 w-5'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13'
          />
        </svg>
        แนบเอกสาร (PDF/TXT)
      </button>

      {/* แสดง Error แบบ Fail-fast ทันทีถ้าไฟล์ผิดเงื่อนไข */}
      {errorMsg && (
        <p className='absolute top-full mt-1 w-max text-xs text-red-500'>
          {errorMsg}
        </p>
      )}
    </div>
  )
}
