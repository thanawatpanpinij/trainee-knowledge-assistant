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
**My Adjustment:** ผมเลือกใช้ SQLite ตามที่ AI แนะนำ เพราะประหยัดเวลา setup Docker และลดความเสี่ยงที่ระบบจะรันไม่ขึ้นตอนผู้ตรวจรันคำสั่งทดสอบ

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

## Session 11: แก้ปัญหา Stale Closure ตอนส่ง `chatId` state

**Prompt:** ผมตั้งใจจะให้ Vercel AI SDK ยืนยันว่าหากผมส่ง `chatId` เข้าไปใน config ของ hook `useChat()` ในรูปแบบ `transport: { body: { chatId } }` มันมีความหมายเดียวกันกับ `transport: { prepareSendMessagesRequest: { body: { chatId } } }` หรือไม่ โดยแนบโค้ดพร้อมถามว่า _"รบกวนคุณ confirm ทีครับว่าโค้ด 2 ตัวนี้ทำงานเหมือนกันจริงๆ หรือไม่?"_
**AI Response:** AI ยืนยันว่า _"ใช่"_ พร้อมแนะนำเพิ่มเติมว่า ให้ส่งค่า `chatId` นี้เข้าไปเป็น Parameter ตัวที่ 2 ของฟังก์ชัน `sendMessage()` แทนวิธีเดิม เพื่อให้ SDK ดึงค่า `chatId` ไปใช้เฉพาะตอนที่ User กดปุ่มส่งข้อความแล้วเท่านั้น วิธีนี้จะการันตีได้ว่าค่า `chatId` จะเป็นค่าล่าสุดเสมอ ไม่ใช่ค่า `null` (Stale Closure) ที่เกิดจากตอน Component เรนเดอร์ครั้งแรก
**My Adjustment:** ผมปรับแก้ตามคำแนะนำ โดยเปลี่ยนจากการตั้งค่าไว้ใน Config ของ hook `useChat()` มาเป็นการส่งผ่าน Parameter ตัวที่ 2 ของฟังก์ชัน `sendMessage()` แทน

## Session 12: แก้ปัญหา Tooling Conflict ระหว่าง Bun กับ Prisma Studio

**Prompt:** ผมอ่าน Official Doc ของ Prisma พบว่าโปรเจกต์ที่ใช้ Bun + SQLite ยังไม่รองรับ Prisma Studio ผมจึงสอบถาม AI ของ Prisma ว่าจะใช้งานได้อย่างไร AI แนะนำให้ลองคำสั่ง `bunx prisma studio` ดูก่อน แต่ผมพบ Error จึงถามกลับไปว่า _"หลังจากใช้คำสั่ง `bunx prisma studio` พบ Error: 'Cannot resolve environment variable: DATABASE_URL.' แบบนี้หมายความว่า Bun ไม่รองรับ Prisma Studio จริงๆ ใช่ไหมครับ?"_
**AI Response:** AI ของ Prisma เสนอให้ใช้ `npx prisma studio` แทน พร้อมกำชับให้ตรวจสอบไฟล์ `prisma.config.ts` ว่ามีการ Inject Env เข้ามาแล้วหรือยัง เนื่องจาก Prisma จะยังไม่ได้ Inject ให้เราตั้งแต่แรก จึงต้อง `import 'dotenv/config'` เข้ามาด้วยตัวเอง
**My Adjustment:** ผมตรวจสอบไฟล์ `prisma.config.ts` พบว่ายังไม่ได้ Import Env จริงตามที่ AI บอก ผมจึงเพิ่ม `import 'dotenv/config'` เข้าไป จากนั้นลองรันด้วย `bunx prisma studio` ดูก่อน (แทนที่จะใช้ `npx` ทันที) เพื่อพิสูจน์ว่าปัญหาเกิดจาก Env หรือ Bun ไม่ซัพพอร์ตกันแน่ ผลคือแอปทำงานได้ปกติ จึงสรุปได้ว่าปัญหาเกิดจากการไม่ได้ Inject Env เข้ามาในไฟล์คอนฟิก ทำให้ Prisma หา `.env` ไม่เจอนั่นเอง

## Session 13: Research การ Implement Timeout Feature

**Prompt:** ผมถาม Vercel AI ว่า _"AI SDK สามารถ implement timeout ได้หรือไม่ และทำได้อย่างไรบ้าง"_
**AI Response:** AI เสนอ 2 แนวทาง คือ 1. Backend Timeout และ 2. Client-Side Timeout (โดยการสร้าง Custom `fetch` Middleware และส่งเข้าไปเป็น Config ของ `useChat()`)
**My Adjustment:** ผมเลือกใช้แนวทางที่ 2 โดยเขียนลอจิกสร้าง Timeout 15 วินาที พร้อมส่ง Abort Signal เข้าไปใน Fetch Function เพื่อให้ระบบตัดการเชื่อมต่อที่ฝั่ง Client ทันที หากใช้เวลาเกินกำหนด ป้องกันไม่ให้ User ต้องรอข้อความเก้อ

## Session 14: การออกแบบ Client-Side Timeout และการจัดการ User Stop Event

**Prompt:** หลังจากลอง Implement ตาม Session 13 ก็พบปัญหาว่าไม่สามารถกดปุ่มหยุดการ Streaming ข้อความได้ (ปุ่มนี้เรียกใช้ฟังก์ชัน `stop()` ของ AI SDK) ผมเลยถาม AI ว่า _"หลังจาก Implement ตามแนวทางก่อนหน้า ผมลองกดปุ่มหยุด Streaming พบว่าไม่สามารถกดหยุดได้ สาเหตุมาจากอะไรครับ"_
**AI Response:** AI อธิบายว่า เบื้องหลังฟังก์ชัน `stop()` คือการส่ง Abort Signal ซึ่งจะทำให้เบราว์เซอร์โยน `TypeError: Failed to fetch` หรือ `AbortError` ออกมา AI จึงแนะนำให้ใช้ Flag หรือตรวจสอบเงื่อนไขใน Error เพื่อแยกแยะสาเหตุของการถูกขัดจังหวะ
**My Adjustment:** ผมปรับ Custom Fetch โดยเพิ่มลอจิกใน `catch` block เพื่อตรวจสอบว่า Error เกิดจาก User ตั้งใจกดหยุด (พฤติกรรมปกติ) หรือหมดเวลาเชื่อมต่อจริงๆ เพื่อนำไปแสดง UI ได้อย่างถูกต้อง นอกจากนี้ ฝั่ง Backend ผมได้เพิ่มการเช็ก `req.signal.aborted` ก่อนเรียก Gemini API เพื่อป้องกันปัญหา Quota Exceeded และหากเกิดการ Abort ขึ้น จะจัดการ Error ด้วยการส่งคืน HTTP 499 (Client Closed Request) แทน 500 เพื่อลด False-positive ใน Server Logs

## Session 15: กลยุทธ์การนับ Token Usage แบบ Single Source of Truth

**Prompt:** เนื่องจากผมยังไม่เคย implement feature นี้มาก่อน ดังนั้นผมเลยเริ่มจากการหาแนวทางในการ implement ก่อนครับ โดยถามว่า _"ก่อนหน้านี้เราได้บันทึก `tokenUsage` พร้อมกับตอนที่ save ข้อความลง database เตรียมไว้แล้ว ต่อมาเป็นขั้นของการนำมาแสดงที่หน้า UI หากผมต้องการนำ token มาแสดง ผมมีแนวทางในการ implement อย่างไรบ้างครับ รบกวนคุณแนะนำผมทีครับ"_
**AI Response:** AI เสนอให้สร้าง API Route แยกต่างหาก (`/api/chat/usage`) และใช้ความสามารถ aggregate (`_sum`) ของ Prisma Database เพื่อคำนวณผลรวมของ `tokenUsage` ภายใน `chatId` นั้นๆ จากนั้นให้ Frontend เป็นคนดึงข้อมูลไปแสดงผล
**My Adjustment:** ผมทำตามแนวทางของ AI เพราะมองว่าการยกหน้าที่คำนวณผลรวมให้ Database จัดการมีความแม่นยำกว่าการให้ Frontend คำนวณเอง โดยผมได้เพิ่ม `useEffect` ให้ Frontend Fetch ข้อมูลตัวเลขใหม่ทุกครั้ง หลังจากที่ AI Streaming ข้อความเสร็จสิ้น (`isLoading` เปลี่ยนเป็น `false`)

## Session 16: การทำ Secure and Idempotent Logout

**Prompt:** _"การ Logout มันควรมีการ error จริงหรือไม่ครับ เราควรมี catch block ไหม? ความเข้าใจของผมคือการ Logout เป็น Idempotent Behaviour ดังนั้นมันควรจะ Logout สำเร็จเสมอ"_
**AI Response:** AI ยืนยันว่า Logic ของการ Logout เป็น Idempotent ถูกต้องแล้ว แต่แนะนำเพิ่มเติมว่ายังควรมี `try...catch` เพื่อรับมือกับ Network Failures (เช่น ผู้ใช้อินเทอร์เน็ตหลุด) เพื่อไม่ให้กระบวนการบนเบราว์เซอร์ล้มเหลว นอกจากนี้ยังแนะนำให้เพิ่ม `finally` block เพื่อ Redirect User กลับไปหน้า Login เสมอ
**My Adjustment:** ผมเห็นด้วย เลยปรับปรุงฝั่ง Client-Side Logic โดยเพิ่ม `router.push('/login')` ไปวางไว้ใน `finally` block เพื่อเป็นหลักประกันว่า ไม่ว่า API ฝั่ง Server จะลบ HTTP-Only Cookie สำเร็จหรือไม่ (หรือเกิด Error ระหว่างทาง) user จะถูก Redirect กลับไปยังหน้าล็อกอินเสมอ

## Session 17: ปรับแผนการทำงานและ Scope Management

**Prompt:** ผมประสบเหตุสุดวิสัยนิดหน่อย ทำให้ต้องเบรกงานไปช่วงนึง พอตารางเวลารวนเป็นโดมิโน่ ผมเลยต้องรื้อแผนการทำงานใหม่โดยอิงจากเวลาที่เหลืออยู่ ผมแนบแผนเดิมให้ AI ดูแล้วบอกว่า _"เนื่องด้วยข้อจำกัดด้านเวลา ในตอนนี้ผมเลยคิดว่าอาจจะต้องตัดส่วนที่ไม่ใช่ core feature ออกไปก่อน ผมจะไม่ทำ RAG และจะเอาเวลาที่เหลือไป focus กับส่วนอื่นๆ แทน ดังนั้นผมเลยอยากรบกวนคุณช่วยวางแผนการทำงาน พร้อมกำหนดระยะเวลาที่ชัดเจนให้ผมทีครับ"_
**AI Response:** AI รับทราบข้อจำกัดและจัดการย่อย Scope งานให้ใหม่ พร้อมกำหนด Timebox (ช่วงเวลาที่ชัดเจน) สำหรับแต่ละ Phase มาให้เสร็จสรรพ เพื่อให้ผมสามารถโฟกัสเฉพาะส่วนที่สำคัญที่สุดได้
**My Adjustment:** ผมจัดการลุยโค้ดและยึดตาม Timeline ใหม่ที่ AI วางไว้ให้ เพื่อให้มั่นใจว่าจะสามารถส่งมอบชิ้นงานได้ทันเวลาครับ

## Session 18: วิเคราะห์ Trade-off ของจังหวะการยิง API (Upload vs Submit)

**Prompt:** ผมมานั่งไล่ Flow ดูแล้วเกิดสงสัยครับ คือตอนนี้พอ User เลือกไฟล์ปุ๊บ เบื้องหลังจะยิง API ไปที่ /api/extract ทันที ทีนี้ถ้าเกิด User เปลี่ยนใจ ลบไฟล์ทิ้ง แล้วอัปโหลดไฟล์ใหม่ มันก็จะกลายเป็นการยิง API รัวๆ หลายครั้ง ผมเลยโยนคำถามไปว่า _"ใน production จริง เขาใช้แนวทางไหนกันครับ เขายิง API ทุกครั้งที่ user กด upload เลย หรือยิง API เฉพาะตอนที่กดส่งข้อความครับ?"_
**AI Response:** AI อธิบายว่าระดับ Production ทำได้ 2 แนวทางหลักๆ คือ 1. ยิงทันทีตอน Upload: ข้อดีคือ UX ดี (Fail-fast) ถ้าไฟล์พังหรืออ่านไม่ได้ User จะรู้ทันที แต่มีข้อเสียคือเปลือง Resource ฝั่ง Server 2. ยิงตอนกดส่งข้อความ: ข้อดีคือประหยัด API Call แบบสุดๆ แต่ข้อเสียคือ UX จะดรอปลง ถ้าไฟล์พัง User จะเพิ่งมารู้ตัวตอนกดส่งไปแล้ว
**My Adjustment:** ผมประเมิน Trade-off แล้วตัดสินใจ**เลือกแนวทางเดิม (ยิง API ทันทีตอน Upload) ครับ** เหตุผลเพราะผมอยากเน้น UX ให้เป็นแบบ Fail-fast มากกว่า User จะได้ไม่หงุดหงิดเวลากดอัปโหลด แล้วเพิ่งมารู้ว่าไฟล์พังตอนกดส่งข้อความครับ ส่วนประเด็นเรื่องการอัปโหลดแล้วลบรัวๆ ผมมองว่าในสถานการณ์จริง ระบบแชต AI มักจะมีข้อจำกัดเรื่องโควต้า (Rate Limit) กั้นไว้อยู่แล้ว ผู้ใช้จึงมักจะคิดมาดีระดับนึงก่อนอัปโหลด โอกาสที่จะเกิด Edge Case นี้จึงมีค่อนข้างน้อยครับ

## Session 19: แก้ปัญหา Next.js Bundle พังตอนใช้ pdf-parse (จากท่า Hack สู่ท่า Best Practice)

**Prompt:** ผมทดลองอัปโหลดไฟล์ PDF เพื่อทดสอบ Feature และพบว่าแอปพัง โดยขึ้น Error ประมาณว่า `Cannot find module '...pdf.worker.mjs'` (หาไฟล์ Worker ไม่เจอ) ผมเลยโยนไปถาม AI ว่า "Error นี้คืออะไรครับ รบกวนคุณช่วยผม debug หาสาเหตุที หากต้องการข้อมูลใดเพิ่มเติมเพื่อให้ debug ได้อย่างตรงจุดมากขึ้น ให้ถามคำถามที่จำเป็นกับผมก่อนดำเนินการต่อไป"
**AI Response:** AI อธิบายว่าไลบรารี `pdf-parse` เบื้องหลังมีการเรียกใช้ `pdf.js` ซึ่งถูกออกแบบมาให้ทำงานกับ Web Worker แต่พอเอามาใช้อ่านไฟล์บนฝั่ง Server ของ Next.js ตัว Bundler มันมัดรวมโค้ดจน Path เพี้ยน หาไฟล์ไม่เจอ AI เลยเสนอแนวทางแก้ไขมา 2 วิธี คือ 1. ส่ง `Option workerSrc: 'none'` เข้าไปเพื่อปิดการใช้งาน Worker หรือ 2. ใช้ท่าประกาศ Global Variable ไว้บนสุดของไฟล์เพื่อหลอกระบบ
**My Adjustment:** ผมประเมินโค้ดที่ AI เสนอมาแล้วรู้สึกว่ามันดูเป็น Workaround หรือ "ท่า Hack" มากกว่าการแก้ปัญหาที่ต้นตอจริงๆ ผมเลยสั่ง AI กลับไปอีกรอบว่าให้หาวิธีแก้ปัญหาที่ต้นตอด้วยท่ามาตรฐาน (Production-Ready) AI เลยเปลี่ยนมาแนะนำวิธีแก้แบบ Official ของ Next.js โดยให้เข้าไปตั้งค่าในไฟล์ `next.config.ts` โดยเพิ่ม `serverExternalPackages: ['pdf-parse', 'pdfjs-dist']` เข้าไป เพื่อบอกให้ Next.js ข้ามการ Bundle ไลบรารีกลุ่มนี้ แล้วไปเรียกใช้จาก `node_modules` โดยตรงแทน ผมเลยเลือกทำตามวิธีนี้ ซึ่งผลลัพธ์คือผมไม่ต้องไปเขียนโค้ด Hack ดักใน API Route เลย โค้ดกลับมาสะอาดสะอ้าน และระบบก็รันผ่านฉลุยครับ
