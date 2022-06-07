import { RegisterUserAccount, setupRegisterUserAccount } from '@/domain/use-cases'
import { makeBcryptHandler, makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepository, makePgCheckDuplicateFieldsRepository } from '@/main/factories/repos/postgres'

export const makeRegisterUserAccount = (): RegisterUserAccount => {
  return setupRegisterUserAccount(
    makePgCheckDuplicateFieldsRepository(),
    makePgUserAccountRepository(),
    makeBcryptHandler(),
    makeJwtTokenHandler()
  )
}
