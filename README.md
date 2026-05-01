# Knowledge Assistant

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Runtime:** Bun
- **Database:** SQLite (via LibSQL adapter)
- **ORM:** Prisma
- **Authentication:** JWT (via `jose`) with HTTP-Only Cookies
- **Validation:** Zod (Environment & Schema validation)
- **Styling:** Tailwind CSS

## Setup & Run

เพื่อให้เป็นไปตามข้อกำหนดของแบบทดสอบ โปรเจกต์นี้ถูกตั้งค่าให้รันได้สมบูรณ์ด้วยคำสั่งเดียวผ่าน Docker โดยกระบวนการติดตั้ง dependencies, การทำ Database Push และการทำ Seeding ข้อมูล Mock User จะถูกจัดการให้โดยอัตโนมัติภายใน Container ครับ

### 1. Environment Setup

สร้างไฟล์ .env และกำหนดค่าดังนี้:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-32-character-secret-key-here"
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

### 2. Running the Application

เริ่มต้นระบบทั้งหมดด้วยคำสั่งเดียว:

```bash
docker compose up
```

**_หมายเหตุ:_** _ระบบจะใช้เวลาในการ Build image และเตรียมฐานข้อมูลในครั้งแรกเล็กน้อย เมื่อเสร็จสิ้นสามารถเข้าใช้งานได้ที่ http://localhost:3000_

## Features Done

### Required Features

- [x] Login + Protected Routes
- [x] Upload File (PDF, TXT)
- [x] Chat with AI (basic)
- [x] Chat with Uploaded File Context
- [x] Token Usage Counter

### Bonus Features

- [x] Markdown rendering
- [ ] Citation
- [x] Streaming response
- [ ] RAG with Vector DB (chunking + embedding + retrieval)
- [x] Conversation history (save/load)
- [ ] Rate limiting / API key rotation
- [x] Docker (Compose + Healthcheck)
- [ ] Unit tests (coverage ≥ 40%)

## Architecture

โปรเจกต์นี้ถูกออกแบบด้วยสถาปัตยกรรมแบบ Full-stack Monorepo โดยใช้ Next.js 16 (App Router) เป็นแกนหลัก ซึ่งมีองค์ประกอบสำคัญดังนี้:

- **Frontend:** พัฒนาด้วย Next.js (ผสมผสานระหว่าง Server Components และ Client Components) พร้อมตกแต่ง UI ด้วย Tailwind CSS
- **Backend & API:** ใช้ Route Handlers ของ Next.js (`src/app/api/...`) ในการจัดการ Business Logic
- **Database Layer:** ใช้ SQLite ผ่าน Prisma ORM (LibSQL adapter) เพื่อให้ง่ายต่อการ Setup บน Docker และมี `schema.prisma` เป็น Single-source-of-truth
- **Authentication & Security:** ใช้ JWT (Stateless) ในการยืนยันตัวตน โดยกระบวนการเข้ารหัส Token จะใช้ Library `jose` เพื่อให้รองรับการทำงานบน Edge Runtime จากนั้นเก็บ Token ไว้ใน HTTP-Only Cookie เพื่อป้องกัน XSS และใช้ไฟล์ `src/proxy.ts` (Middleware) ดักจับ Request เพื่อปกป้อง Routes ที่สำคัญ (สำหรับหน้า `/chat` และ `/upload`)
- **AI Integration:** เตรียมรองรับ Vercel AI SDK สำหรับการจัดการ State ฝั่งหน้าบ้านและการทำ Streaming Response

## Known Issues

- **ปัญหาด้านประสิทธิภาพในการโหลดประวัติการสนทนา (Chat History Performance):** ในปัจจุบัน ระบบจะดึงข้อมูลและแสดงผลประวัติการแชตทั้งหมดมาในครั้งเดียว (Fetch all at once) หากผู้ใช้งานมีประวัติการสนทนาที่ยาวมาก การไม่มีระบบแบ่งหน้า (Pagination) หรือการเลื่อนโหลด (Infinite Scroll) อาจส่งผลให้หน้าเว็บโหลดช้าลง หรือเกิดอาการ UI กระตุก/ค้างได้ เนื่องจากเบราว์เซอร์ต้องเรนเดอร์ DOM elements จำนวนมหาศาลพร้อมกัน
- **First Message Interruption on New Chat:** เมื่อเริ่มต้นสร้างการสนทนาใหม่ (New Chat) และกดส่งข้อความแรก ระบบจะทำการสร้าง `chatId` และ Redirect ผู้ใช้ไปยังหน้า Dynamic Route ของแชตนั้นๆ ทันที กระบวนการ Redirect นี้ทำให้เกิดการตัดการเชื่อมต่อ (Interrupt/Abort) ของ AI Response Stream ส่งผลให้คำตอบของ AI ถูกยกเลิกกลางคัน ทำให้ผู้ใช้ต้องพิมพ์ข้อความ และกดส่งใหม่เพื่อเริ่มสนทนากับ AI
- **UI/UX Glitches & Unpolished Design:** ต้องยอมรับตามตรงว่าในส่วนของการแสดงผล (UI) ยังมี Visual Bugs หรือจุดที่ทำงานได้ไม่สมบูรณ์/ไม่เรียบร้อยอยู่บ้างครับ เนื่องด้วยข้อจำกัดด้านเวลา ผมจึงตัดสินใจทำ Trade-off โดยเลือกปล่อยผ่านปัญหาด้านการแสดงผลเหล่านี้ไปก่อน เพื่อนำเวลาไปโฟกัสกับการทำให้ Core Features, ระบบหลังบ้าน, และการเชื่อมต่อ AI ทำงานได้อย่างถูกต้องและเสถียรที่สุดครับ
