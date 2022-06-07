import { Authentication, setupAuthentication } from '@/domain/use-cases'
import { makeBcryptHandler, makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepository } from '@/main/factories/repos/postgres'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(
    makePgUserAccountRepository(),
    makeBcryptHandler(),
    makeJwtTokenHandler()
  )
}
