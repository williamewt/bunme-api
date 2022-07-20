import { LoginController } from '@/application/controllers'
import { ServerError } from '@/application/errors'
import { EmailValidation, MinLengthValidation, RequiredStringValidation } from '@/application/validation'

describe('LoginController', () => {
  let authenticate: jest.Mock
  let sut: LoginController
  let email: string
  let password: string

  beforeAll(() => {
    authenticate = jest.fn()
    authenticate.mockResolvedValue({ accessToken: 'any_value' })
    email = 'any_email@email.com'
    password = 'any_password'
  })

  beforeEach(() => {
    sut = new LoginController(authenticate)
  })

  it('should build validators correctly', () => {
    const validators = sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredStringValidation('any_email@email.com', 'email'),
      new EmailValidation('any_email@email.com'),
      new RequiredStringValidation('any_password', 'password'),
      new MinLengthValidation('any_password', 'password', 6)
    ])
  })

  it('should call Authenticate with correct params', async () => {
    await sut.handle({ email, password })

    expect(authenticate).toHaveBeenCalledWith({ email, password })
    expect(authenticate).toHaveBeenCalledTimes(1)
  })

  it('should return 500 if server error', async () => {
    authenticate.mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError()
    })
  })

  it('should return 200 if auhtentication success', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
