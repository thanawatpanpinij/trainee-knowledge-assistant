import { ENV } from '@shared/config'

export function getJwtSecretKey() {
  return new TextEncoder().encode(ENV.AUTH_SECRET)
}
