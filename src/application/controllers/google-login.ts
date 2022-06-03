import { HttpResponse, unauthorized, ok } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'
import { GoogleAuthentication } from '@/domain/use-cases'

type HttpRequest = { code: string }

type Model = Error | { accessToken: string }

export class GoogleLoginController extends Controller {
  constructor (private readonly googleAuth: GoogleAuthentication) {
    super()
  }

  async perform ({ code }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.googleAuth({ code })
      return ok(accessToken)
    } catch {
      return unauthorized()
    }
  }

  override buildValidators ({ code }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: code, fieldName: 'code' }).required().build()
    ]
  }
}
