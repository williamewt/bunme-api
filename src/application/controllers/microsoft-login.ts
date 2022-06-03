import { HttpResponse, unauthorized, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'
import { MicrosoftAuthentication } from '@/domain/use-cases'

type HttpRequest = { token: string }

type Model = Error | { accessToken: string }

export class MicrosoftLoginController extends Controller {
  constructor (private readonly microsoftAuth: MicrosoftAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.microsoftAuth({ token })
      return ok(accessToken)
    } catch {
      return unauthorized()
    }
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
