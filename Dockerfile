# Stage 1: Base - Official Image ของ Bun
FROM oven/bun:alpine AS base

# Stage 2: Dependencies - ติดตั้ง Package
FROM base AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 3: Builder - สร้าง Prisma Client และ Build Next.js
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# สร้าง Client และ Build
RUN bunx prisma generate
RUN bun run build

# Stage 4: Runner - รันแอปพลิเคชัน (ใช้ Node.js รัน Standalone เสถียรที่สุด)
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# คัดลอกเฉพาะไฟล์ที่จำเป็น
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/dotenv ./node_modules/dotenv
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/async-mutex ./node_modules/async-mutex

# Copy Prisma CLI และ dependencies ที่จำเป็น
COPY --from=builder /app/generated ./generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/effect ./node_modules/effect
COPY --from=builder /app/node_modules/fast-check ./node_modules/fast-check
COPY --from=builder /app/node_modules/pure-rand ./node_modules/pure-rand
COPY --from=builder /app/node_modules/pathe ./node_modules/pathe
COPY --from=builder /app/node_modules/proper-lockfile ./node_modules/proper-lockfile
COPY --from=builder /app/node_modules/graceful-fs ./node_modules/graceful-fs
COPY --from=builder /app/node_modules/retry ./node_modules/retry
COPY --from=builder /app/node_modules/std-env ./node_modules/std-env
COPY --from=builder /app/node_modules/valibot ./node_modules/valibot
COPY --from=builder /app/node_modules/zeptomatch ./node_modules/zeptomatch
COPY --from=builder /app/node_modules/graphmatch ./node_modules/graphmatch
COPY --from=builder /app/node_modules/grammex ./node_modules/grammex
COPY --from=builder /app/node_modules/get-port-please ./node_modules/get-port-please
COPY --from=builder /app/node_modules/remeda ./node_modules/remeda
COPY --from=builder /app/node_modules/c12 ./node_modules/c12
COPY --from=builder /app/node_modules/exsolve ./node_modules/exsolve
COPY --from=builder /app/node_modules/jiti ./node_modules/jiti
COPY --from=builder /app/node_modules/rc9 ./node_modules/rc9
COPY --from=builder /app/node_modules/destr ./node_modules/destr
COPY --from=builder /app/node_modules/defu ./node_modules/defu
COPY --from=builder /app/node_modules/pkg-types ./node_modules/pkg-types
COPY --from=builder /app/node_modules/confbox ./node_modules/confbox
COPY --from=builder /app/node_modules/perfect-debounce ./node_modules/perfect-debounce
COPY --from=builder /app/node_modules/deepmerge-ts ./node_modules/deepmerge-ts

EXPOSE 3000

# รันด้วย node ตามมาตรฐานของ Next.js Standalone
CMD ["sh", "-c", "node node_modules/prisma/build/index.js migrate deploy && node node_modules/prisma/build/index.js db seed && node server.js"]