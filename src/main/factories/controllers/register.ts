
import { RegisterController } from '@/application/controllers'
import { makeRegisterUserAccount } from '@/main/factories/use-cases'

export const makeRegisterController = (): RegisterController => {
  return new RegisterController(makeRegisterUserAccount())
}
