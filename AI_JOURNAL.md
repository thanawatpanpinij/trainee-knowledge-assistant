# Al Usage Journal

## Session 1: Planning the 5-day development schedule

**Prompt:** _"ผมอยากรบกวนคุณช่วยอ่านรายละเอียดตามที่ผมส่งไปข้างต้น และวางแผนการทำงานว่าจะทำอย่างไรให้ทันภายใน 5 วัน แต่เริ่มแรกผมอยากให้คุณถามคำถามที่จำเป็นสำหรับการวางแผนงานกับผมก่อนที่จะดำเนินการวางแผนต่อไป ทั้งนี้ก็เพื่อให้คุณทราบว่าผมมีข้อจำกัดใดบ้าง (มีส่วนไหนที่ผมสามารถทำได้เร็ว ทำได้ช้า) จะได้วางแผนกันได้อย่างตรงจุด และตรงความเป็นจริงกันมากที่สุดครับ"_
**Al Response:** AI ถามคำถาม และเสนอแผน 5 วัน โดยแบ่งเป็น Phase ชัดเจน (เช่น Setup, Core Features, AI Integration, Refinements) และกำหนดยอดเวลาทำงานในแต่ละวันอย่างเหมาะสม
**My Adjustment:** ผมปรับแผนของ AI เล็กน้อยโดยเพิ่มเวลาช่วงท้ายของแต่ละวันสำหรับการเขียน Document (README, AI_JOURNAL, DECISIONS) เพื่อไม่ให้ลืมรายละเอียด และตัดสินใจลดสัดส่วนของ Bonus features บางตัวที่ไม่ถนัดออกไปก่อน เพื่อให้โฟกัสกับ Core Feature ได้เต็มที่

## Session 2: Designing the project folder structure

**Prompt:** ผมอธิบายรายละเอียดของโปรเจกต์ และบอกรายละเอียดเกี่ยวกับ Achitecture ที่คิดและวางแผนคร่าวๆ เอาไว้ และ prompt _"รบกวนคุณลองแนะนำ Folder Structure ที่ไม่ over-engineer สำหรับขนาดของโปรเจกต์ และไม่เป็นโทษสำหรับระยะเวลาการพัฒนามากเกินไปให้ผมมาก่อนทีครับ"_
**Al Response:** แนะนำโครงสร้าง โดยมี folder ได้แก่ `src/app/` (แยก routing/UI), `src/components/`, `src/services/`, และ `src/lib/`
**My Adjustment:**
เนื่องด้วย AI แนะนำให้นำเอาไฟล์ `env.ts` (env validation) และ helper function เอาไว้ภายใน folder `src/lib/` ซึ่งผมมองว่ามันจะกลายเป็นถังรวมทุกสิ่งอย่าง ส่งผลให้ Boundary ไม่ชัดเจน ดังนั้นผมเลยปรับให้ Boundary ชัดเจนขึ้น โดย:

- ให้ไฟล์ `env.ts` อยู่ภายใน folder `src/config/` เพราะจัดเป็น Core Configuration ของระบบ
- ให้ helper function ต่างๆ อยู่ใน folder `src/utils/`
- ให้ folder `src/lib/` เป็นเพียงแค่ folder ที่เก็บเครื่องมือภายนอก (เช่น SQLite และ Chroma DB)

จนกลายเป็น Folder Structure ปัจจุบัน ดังที่เขียนอธิบายเอาไว้ในไฟล์ `src/docs/FOLDER_STRUCTURE.md` ครับ

## Session 3: Choosing the right Database (MongoDB vs SQLite)

**Prompt:** ตอนที่บอกรายละเอียดเกี่ยวกับ Achitecture ผมบอกว่าจะใช้ MongoDB ด้วย Prompt ประมาณ _"สำหรับ Database ผมคิดว่าจะใช้ MongoDB เพราะเป็นตัวที่เคยทำมาก่อน ซึ่งคิดว่าจะช่วยย่นระยะเวลาในการพัฒนาได้ เพราะคุ้นเคยอยู่แล้ว..."_
**Al Response:** AI ทักท้วงพร้อมทั้งเปรียบเทียบข้อดี-ข้อเสีย และแนะนำ SQLite (รันผ่านไฟล์ local ได้เลย) ว่าเหมาะกับโจทย์ที่บังคับใช้ `docker compose up` คำสั่งเดียว มากกว่า MongoDB ที่ต้อง setup container แยกซึ่งอาจจะซับซ้อนเกินไป นอกจากนี้ยังประจวบเหมาะกับที่ผมเคยใช้มาก่อนอีกด้วย ทำให้ผมไม่ต้องเรียนรู้เพิ่มเติมมาก ผมเลยเลือกใช้ SQLite ตามที่ AI แนะนำครับ
**My Adjustment:** ผมเลือกใช้ SQLite AI แนะนำ เพราะประหยัดเวลา setup Docker และลดความเสี่ยงที่ระบบจะรันไม่ขึ้นตอนผู้ตรวจรันคำสั่งทดสอบ

## Session 4: Selecting ORM (Prisma vs Drizzle)

**Prompt:** ก่อนหน้าที่จะคุยเรื่องนี้ AI ได้แนะนำ Prisma มาอยู่แล้ว เพราะเหตุผลที่ผมต้องการความเร็วในการพัฒนา แต่ผมเห็นว่ามี Drizzle ที่น่าสนใจเหมือนกัน ซึ่งกำลังเป็นที่เป็นที่นิยม รวมถึงเบาและเร็วด้วย ผมเลยถามว่า _"ผมย้อนถามนิดนึงได้ไหมครับว่าเหตุใดคุณถึงแนะนำให้ผมใช้ Prisma ORM แทน Drizzle ORM ครับ ผมได้ยินมาว่า Drizzle เร็วกว่าและกำลังเป็นที่นิยมในปัจจุบันอยู่"_
**Al Response:** อธิบายว่า Drizzle เร็วกว่าและเบากว่า แต่ Prisma มี DX (Developer Experience) ที่ดีกว่า มี schema อัตโนมัติและ Auto-complete ที่สมบูรณ์กว่า เหมาะกับการปั่นงานด่วน
**My Adjustment:** ตัดสินใจเลือก Prisma แม้ Performance จะสู้ Drizzle ไม่ได้ แต่ผมต้องการความเร็วในการเขียนและลดขั้นตอนการคิดให้น้อยลง

## Session 5: Primary Key Generation Strategy (`cuid()` vs `uuid()`)

**Prompt:** ระหว่างที่กำลัง implement ขั้นตอน "ติดตั้ง SQLite และเตรียมโครงสร้างตาราง (User, Chat History)" ตามแผนที่วางไว้ AI เสนอ schema ซึ่งมีการใช้ `cuid()` ภายใน แต่ผมเคยใช้แค่ `uuid()` เลยไม่แน่ใจว่า `cuid()` คืออะไร และจำเป็นจริงหรือไม่ ผมเลยถามว่า _"`cuid()` คืออะไร และเหตุใดคุณถึงใช้ `cuid()` แทนการใช้ `uuid()` มันต่างจาก `uuid()` ยังไงบ้างครับ?"_
**Al Response:** อธิบายว่า `uuid` เป็นการสุ่มแบบสมบูรณ์ ส่วน `cuid` มี timestamp ผสมอยู่ด้วย ทำให้เป็นมิตรกับ URL และสามารถเรียงลำดับ (sortable) ได้ดีกว่า ช่วยเรื่อง Database Indexing
**My Adjustment:** เรื่องนี้เป็นความรู้ใหม่ ผมเลยเปลี่ยนไปใช้ `cuid()` ทุก Model ของ Prisma ตามที่ได้เรียนรู้จาก AI เพราะได้ประโยชน์เรื่องการเรียงลำดับเวลาของข้อมูลครับ

## Session 6: Understanding Prisma Relation Constraints (`onDelete: Cascade`)

**Prompt:** ผมถามเรื่องนี้ในแชตเดียวกันกับ session ที่ 5 เลยครับ AI เสนอ schema ที่มีการใช้ `onDelete: Cascade` ผมสงสัยว่าคืออะไรเลยถามว่า _"ใน Prisma `onDelete: Cascade` คืออะไร และหมายความว่ายังไงครับ"_
**Al Response:** อธิบายว่าเป็นการตั้งค่า Foreign Key ว่าถ้า Record หลักถูกลบ Record ลูกที่อ้างอิงอยู่ก็จะถูกลบทิ้งไปด้วยอัตโนมัติ เพื่อไม่ให้เกิดข้อมูลกำพร้า (Orphaned records)
**My Adjustment:** นำแนวคิดนี้ไปปรับใช้ใน Schema ทันที เพื่อให้ตอนลบข้อมูล Session หรือ User ข้อมูลแชตที่เกี่ยวข้องจะถูกเคลียร์ไปด้วย ช่วยลดภาระการเขียน Logic ลบข้อมูลเองใน Service

## Session 7: Handling Prisma Client in Next.js (Hot Reload Issue)

**Prompt:** _"จากโค้ดเรื่องการสร้าง PrismaClient ผ่าน `globalThis` ที่คุณแนะนำมาก่อนหน้านี้ มันหมายความว่าอย่างไรครับ และเหตุใดถึงต้องเขียนด้วยท่านี้ รบกวนช่วยอธิบายให้ฟังทีครับ"_
**Al Response:** AI ชี้แจงว่าโค้ดนั้นคือเทคนิค "Prisma Client Singleton Pattern" เพื่อแก้ปัญหาของ Next.js ในโหมด Dev (Hot Reload) ที่มักจะสร้าง Prisma Client Instance ใหม่ทุกครั้งที่เราเซฟไฟล์ โค้ดท่านี้จะช่วยป้องกันไม่ให้เกิดปัญหา Database Connection เต็มครับ
**My Adjustment:** หลังจากเข้าใจคอนเซปต์ ผมไปรีเช็กกับ Official Docs ของ Prisma และได้ทำการ Refactor โค้ดที่ AI ให้มาใหม่หลายจุดเพื่อให้เข้ากับมาตรฐานโปรเจกต์ของผมครับ:

1. เปลี่ยนท่าการทำ Global type จาก `declare global` มาใช้ `global as unknown as { prisma: PrismaClient }` ตาม Docs ล่าสุด
2. นำ `PrismaLibSql` adapter เข้ามาใช้งาน และเปลี่ยน Path การ import เป็น `generated/prisma/client` ตามที่ได้ตั้งค่า Output ไว้
3. เปลี่ยนวิธีการเข้าถึงค่า ENV จาก Dot notation มาเป็น Bracket notation (`ENV['DATABASE_URL']`) เพื่อรักษา Consistency และให้โค้ดผ่าน Rule `"noPropertyAccessFromIndexSignature": true` ที่ผมตั้งค่าไว้ใน `tsconfig.json` ครับ

## Session 8: Evaluating DI (Dependency Injection) Pattern

**Prompt:** _"เพื่อแก้ปัญหา Hot-reload ผมประยุกต์ใช้ pattern DI แบบ Clean Arch (new service ครั้งเดียวแล้ว inject เข้า class) ได้ไหมครับ วิธีนี้แก้ไขปัญหาได้หรือไม่ครับ"_
**Al Response:** อธิบายว่าทำได้ แต่สำหรับ Next.js App Router การทำ DI แบบ OOP เต็มรูปแบบอาจจะ Over-engineer เกินไป และแนะนำว่าท่า Singleton ที่เคยให้ไปนั้นเป็น Best Practice ที่ชุมชน Next.js นิยมมากกว่า
**My Adjustment:** ผมล้มเลิกความคิดที่จะเขียนแบบ DI เต็มรูปแบบ เพื่อไม่ให้โปรเจกต์ซับซ้อนเกินความจำเป็น หันมาใช้ Singleton Pattern ตามมาตรฐานแทน

## Session 9: Implementing Protected Routes and JWT with `jose`

**Prompt:** ระหว่างที่ผมกำลังทำขั้นตอน "สร้างหน้า Login และทำระบบ Protected Routes (จำลอง User/Password ตามโจทย์)" ตามแผนที่วางไว้ AI แนะนำ `jose` แต่ผมสงสัยว่าทำไมไม่ใช้ `jsonwebtoken` ผมเลยถามว่า _"เหตุใดคุณถึงแนะนำให้ผมใช้ `jose` แทนการใช้ `jsonwebtoken` ทั้งๆ ที่ผมเคยใช้ `jsonwebtoken` มาก่อน ตรงนี้มีความจำเป็นอย่างไร รบกวนคุณอธิบายให้ผมฟังทีครับ"_
**Al Response:** อธิบายความแตกต่างของ Edge Runtime (ที่เบาและถูกตัด Node APIs อย่าง crypto ออก) กับ Node.js Runtime จึงแนะนำไลบรารี `jose` ที่ใช้ Web Crypto API มาตรฐานแทน
**My Adjustment:** เป็นความรู้ใหม่ ผมเลยเปลี่ยนมาใช้ `jose` แทน `jsonwebtoken` ที่คุ้นเคย และตั้งค่าสร้าง Token โดยยัดใส่ HTTP-Only Cookie เพื่อความปลอดภัยขั้นสูงสุด

## Session 10: Vercel AI SDK Concept (Core vs UI)

**Prompt:** _"Vercel AI SDK Core กับ Vercel AI SDK UI ต่างกันยังไงครับ"_
**Al Response:** อธิบายว่า Core ใช้สำหรับฝั่ง Server Route Handlers เพื่อเชื่อมต่อ Provider (มีฟังก์ชันอย่าง `streamText`) ส่วน UI ใช้สำหรับหน้าบ้าน React (มี Hook อย่าง `useChat`) เพื่อจัดการ State ของข้อความ
**My Adjustment:** นำความเข้าใจนี้ไปวางแผนแยกไฟล์ชัดเจน โดยใช้ SDK Core จัดการ API ควบคู่กับ SDK UI ในฝั่ง Client Component ทำให้จัดการเรื่อง Streaming ได้ง่ายขึ้นมาก
