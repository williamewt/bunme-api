import { RegisterController } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { EmailValidation, EqualsValidation, RequiredStringValidation } from '@/application/validation'

describe('RegisterController', () => {
  let registerUserAccount: jest.Mock
  let sut: RegisterController
  let name: string
  let email: string
  let password: string
  let passwordConfirmation: string

  beforeAll(() => {
    registerUserAccount = jest.fn()
    registerUserAccount.mockResolvedValue({ accessToken: 'any_value' })
    name = 'any_name'
    email = 'any_email@email.com'
    password = 'any_password'
    passwordConfirmation = 'any_password'
  })

  beforeEach(() => {
    sut = new RegisterController(registerUserAccount)
  })

  it('should build validators correctly', () => {
    const validators = sut.buildValidators({ name, email, password, passwordConfirmation })

    expect(validators).toEqual([
      new RequiredStringValidation('any_name', 'name'),
      new RequiredStringValidation('any_email@email.com', 'email'),
      new EmailValidation('any_email@email.com'),
      new RequiredStringValidation('any_password', 'password'),
      new EqualsValidation('password', 'any_password', 'any_password')
    ])
  })

  it('should call RegisterUserAccount with correct params', async () => {
    await sut.handle({ name, email, password, passwordConfirmation })

    expect(registerUserAccount).toHaveBeenCalledWith({ name, email, password, passwordConfirmation })
    expect(registerUserAccount).toHaveBeenCalledTimes(1)
  })

  it('should return 500 if server error', async () => {
    registerUserAccount.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError()
    })
  })

  it('should return 200 if registration success', async () => {
    const httpResponse = await sut.handle({ name, email, password, passwordConfirmation })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
