import z from 'zod'

const envSchema = z.object({
  AUTH_SECRET: z
    .string()
    .min(32, 'AUTH_SECRET is required and should be at least 32 characters'),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  DATABASE_URL: z
    .string()
    .startsWith('file:', "SQLite DATABASE_URL must start with 'file:'"),
})

const rawEnv = {
  AUTH_SECRET: process.env['AUTH_SECRET'],
  GOOGLE_GENERATIVE_AI_API_KEY: process.env['GOOGLE_GENERATIVE_AI_API_KEY'],
  DATABASE_URL: process.env['DATABASE_URL'],
}

function validateEnv() {
  const env = envSchema.safeParse(rawEnv)

  if (!env.success) {
    console.error(
      '❌ Invalid environment variables:',
      z.flattenError(env.error)
    )
    process.exit(1)
  }

  return env.data
}

export const ENV = validateEnv()
