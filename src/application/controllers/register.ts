import { HttpResponse, serverError, ok, badRequest } from '@/application/helpers'
import { ValidationBuilder, Validator } from '@/application/validation'
import { Controller } from '@/application/controllers'
import { RegisterUserAccount } from '@/domain/use-cases'
import { DuplicateFieldError } from '@/application/errors'

type HttpRequest = { name: string, email: string, password: string, passwordConfirmation: string }

type Model = Error | { accessToken: string }

export class RegisterController extends Controller {
  constructor (private readonly registerUserAccount: RegisterUserAccount) {
    super()
  }

  async perform (params: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.registerUserAccount(params)
      if (accessToken !== undefined) {
        return ok(accessToken)
      }
      return badRequest(new DuplicateFieldError('email'))
    } catch (error: any) {
      return serverError(error)
    }
  }

  override buildValidators (params: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder.of({ value: params.name, fieldName: 'name' }).required().build(),
      ...ValidationBuilder.of({ value: params.email, fieldName: 'email' }).required().email().build(),
      ...ValidationBuilder.of({ value: params.password, fieldName: 'password' }).required().equals(params.passwordConfirmation).build()
    ]
  }
}
