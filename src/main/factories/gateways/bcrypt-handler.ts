
import { BcryptHandler } from '@/infra/crypto'
import { env } from '@/main/config/env'

export const makeBcryptHandler = (): BcryptHandler => {
  return new BcryptHandler(env.bcryptSalt)
}
