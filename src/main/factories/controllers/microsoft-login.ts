
import { MicrosoftLoginController } from '@/application/controllers'
import { makeMicrosoftAuthentication } from '@/main/factories/use-cases'

export const makeMicrosoftLoginController = (): MicrosoftLoginController => {
  return new MicrosoftLoginController(makeMicrosoftAuthentication())
}
