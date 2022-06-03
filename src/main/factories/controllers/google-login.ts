
import { GoogleLoginController } from '@/application/controllers'
import { makeGoogleAuthentication } from '@/main/factories/use-cases'

export const makeGoogleLoginController = (): GoogleLoginController => {
  return new GoogleLoginController(makeGoogleAuthentication())
}
