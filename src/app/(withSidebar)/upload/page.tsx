'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileUpload } from '@shared/components'

export default function UploadPage() {
  const router = useRouter()
  const [isExtracting, setIsExtracting] = useState<boolean>(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleFileUpload = async (file: File) => {
    setIsExtracting(true)
    setErrorMsg(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      // ยิง API สกัด Text ที่เราทำไว้หลังบ้าน
      const res = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Extract failed')
      }

      // เก็บ Text และชื่อไฟล์ ลง sessionStorage
      sessionStorage.setItem('fileContext', data.text)
      sessionStorage.setItem('fileName', file.name)

      // อัปโหลดสำเร็จ นำทางไปหน้าแชททันที
      router.push('/chat')
    } catch (error: unknown) {
      console.error('Error uploading file:', error)
      if (error instanceof Error) {
        setErrorMsg(error.message)
      } else {
        setErrorMsg('เกิดข้อผิดพลาดในการอัปโหลดไฟล์')
      }
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6'>
      <div className='w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl'>
        <div className='text-center'>
          <h1 className='mb-2 text-2xl font-bold text-gray-900'>
            อัปโหลดเอกสาร 📄
          </h1>
          <p className='text-sm text-gray-500'>
            อัปโหลดไฟล์ PDF หรือ TXT เพื่อให้ AI ช่วยวิเคราะห์และตอบคำถามของคุณ
          </p>
        </div>

        {errorMsg && (
          <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600'>
            {errorMsg}
          </div>
        )}

        <div className='flex flex-col items-center justify-center py-4'>
          {/* นำ Component FileUpload ของเรามาใช้ตรงนี้ */}
          <FileUpload onFileSelect={handleFileUpload} disabled={isExtracting} />
        </div>

        {isExtracting && (
          <div className='animate-pulse text-center text-sm font-medium text-blue-600'>
            กำลังอ่านและสกัดข้อความจากไฟล์... ⏳
          </div>
        )}

        <div className='border-t border-gray-100 pt-4 text-center'>
          <button
            onClick={() => router.push('/chat')}
            disabled={isExtracting}
            className='text-sm text-gray-400 transition-colors hover:text-gray-700'
          >
            ข้ามไปหน้าแชทโดยไม่อัปโหลดเอกสาร &rarr;
          </button>
        </div>
      </div>
    </div>
  )
}
