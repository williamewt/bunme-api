import { HttpResponse, serverError, ok, badRequest } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'
import { Authentication } from '@/domain/use-cases'
import { InvalidCredentialsError } from '@/application/errors'

type HttpRequest = { email: string, password: string }

type Model = Error | { accessToken: string }

export class LoginController extends Controller {
  constructor (private readonly authenticate: Authentication) {
    super()
  }

  async perform (params: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.authenticate(params)
      if (accessToken !== undefined) {
        return ok(accessToken)
      }
      return badRequest(new InvalidCredentialsError())
    } catch (error: any) {
      return serverError(error)
    }
  }

  override buildValidators (params: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: params.email, fieldName: 'email' }).required().email().build(),
      ...ValidationBuilder.of({ value: params.password, fieldName: 'password' }).required().build()
    ]
  }
}
