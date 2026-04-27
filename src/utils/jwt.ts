import { ENV } from '@config/env'

export function getJwtSecretKey() {
  return new TextEncoder().encode(ENV.AUTH_SECRET)
}
