
import { MicrosoftAuthentication, setupMicrosoftAuthentication } from '@/domain/use-cases'
import { makeMicrosoftApi, makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepository } from '@/main/factories/repos/postgres'

export const makeMicrosoftAuthentication = (): MicrosoftAuthentication => {
  return setupMicrosoftAuthentication(
    makeMicrosoftApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler()
  )
}
