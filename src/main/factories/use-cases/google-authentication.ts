
import { GoogleAuthentication, setupGoogleAuthentication } from '@/domain/use-cases'
import { makeGoogleApi, makeJwtTokenHandler } from '@/main/factories/gateways'
import { makePgUserAccountRepository } from '@/main/factories/repos/postgres'

export const makeGoogleAuthentication = (): GoogleAuthentication => {
  return setupGoogleAuthentication(
    makeGoogleApi(),
    makePgUserAccountRepository(),
    makeJwtTokenHandler()
  )
}
