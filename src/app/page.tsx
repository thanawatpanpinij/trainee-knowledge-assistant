import { redirect } from 'next/navigation'

// การตรวจ cookie/JWT และ redirect จาก `/` ไป `/chat` หรือ `/login` ทำที่ `src/proxy.ts` ก่อนเข้า route นี้
export default function HomePage() {
  redirect('/chat')
}
