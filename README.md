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

### 1. Installation

```bash
bun install
```

### 2. Environment Setup

สร้างไฟล์ .env และกำหนดค่าดังนี้:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-32-character-secret-key-here"
GOOGLE_GENERATIVE_AI_API_KEY="your-api-key"
```

### 3. Running the Application

เริ่มต้นระบบทั้งหมดด้วยคำสั่งเดียว:

```bash
docker compose up --build
```

**_หมายเหตุ:_** _ระบบจะใช้เวลาในการ Build image และเตรียมฐานข้อมูลในครั้งแรกเล็กน้อย เมื่อเสร็จสิ้นสามารถเข้าใช้งานได้ที่ http://localhost:3000_

## Features Done

- [x] Login + Protected Routes
- [ ] File Upload
- [ ] RAG (not done yet)

## Architecture

โปรเจกต์นี้ถูกออกแบบด้วยสถาปัตยกรรมแบบ Full-stack Monorepo โดยใช้ Next.js 16 (App Router) เป็นแกนหลัก ซึ่งมีองค์ประกอบสำคัญดังนี้:

- **Frontend:** พัฒนาด้วย Next.js (ผสมผสานระหว่าง Server Components และ Client Components) พร้อมตกแต่ง UI ด้วย Tailwind CSS
- **Backend & API:** ใช้ Route Handlers ของ Next.js (`src/app/api/...`) ในการจัดการ Business Logic
- **Database Layer:** ใช้ SQLite ผ่าน Prisma ORM (LibSQL adapter) เพื่อให้ง่ายต่อการ Setup บน Docker และมี `schema.prisma` เป็น Single-source-of-truth
- **Authentication & Security:** ใช้ JWT (Stateless) ในการยืนยันตัวตน โดยกระบวนการเข้ารหัส Token จะใช้ Library `jose` เพื่อให้รองรับการทำงานบน Edge Runtime จากนั้นเก็บ Token ไว้ใน HTTP-Only Cookie เพื่อป้องกัน XSS และใช้ไฟล์ `src/proxy.ts` (Middleware) ดักจับ Request เพื่อปกป้อง Routes ที่สำคัญ (สำหรับหน้า `/chat` และ `/upload`)
- **AI Integration (Upcoming):** เตรียมรองรับ Vercel AI SDK สำหรับการจัดการ State ฝั่งหน้าบ้านและการทำ Streaming Response

## Known Issues

[things you know are not great yet]
