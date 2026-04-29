import { NextResponse } from 'next/server'
import { PasswordException, PDFParse } from 'pdf-parse'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ที่อัปโหลด' },
        { status: 400 }
      )
    }

    // 🔒 Security Hardening: ตรวจสอบขนาดไฟล์ที่ฝั่ง Server (ห้ามเกิน 5MB)
    const MAX_FILE_SIZE_MB = 5
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: 'ไฟล์มีขนาดใหญ่เกินไป' },
        { status: 413 }
      )
    }

    let extractedText = ''

    // 🔒 Security Hardening: ตรวจสอบและจัดการตามประเภทไฟล์เท่านั้น
    if (file.type === 'text/plain') {
      extractedText = await file.text()
    } else if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // 2. ปรับวิธีการเรียกใช้ตาม Document v2/v3
      // ส่ง buffer เข้าไปผ่าน property 'data'
      const parser = new PDFParse({ data: buffer })

      // 🌟 เพิ่ม try...catch...finally เฉพาะสำหรับการอ่าน PDF
      try {
        const result = await parser.getText()
        extractedText = result.text
      } catch (pdfError: unknown) {
        // ดักจับกรณีไฟล์ติดรหัสผ่านโดยเฉพาะ
        if (pdfError instanceof PasswordException) {
          return NextResponse.json(
            { error: 'ไฟล์ PDF ติดรหัสผ่าน กรุณาปลดล็อกก่อนอัปโหลดครับ' },
            { status: 400 }
          )
        }
        // ถ้าเป็น Error อื่นๆ ของ PDF โยนออกไปให้ catch ตัวนอกสุดจัดการ
        throw pdfError
      } finally {
        // 🌟 การันตีการคืนหน่วยความจำ (Memory) เสมอ ไม่ว่าจะเกิด Error หรือไม่
        await parser.destroy()
      }
    } else {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์ PDF และ TXT เท่านั้น' },
        { status: 415 }
      )
    }

    // จัดการทำความสะอาดข้อความ (Sanitize)
    extractedText = extractedText.replace(/\s+/g, ' ').trim()

    return NextResponse.json({ text: extractedText })
  } catch (error: unknown) {
    console.error('[Upload API Error]:', error)

    return NextResponse.json(
      {
        error:
          'เกิดข้อผิดพลาดในระบบเซิร์ฟเวอร์ขณะอ่านไฟล์ กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ',
      },
      { status: 500 }
    )
  }
}
