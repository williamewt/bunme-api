import { AuthenticationError } from '@/domain/entities/errors'
import { MicrosoftLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidation } from '@/application/validation'

describe('MicrosoftLoginController', () => {
  let microsoftAuth: jest.Mock
  let sut: MicrosoftLoginController
  let token: string

  beforeAll(() => {
    microsoftAuth = jest.fn()
    microsoftAuth.mockResolvedValue({ accessToken: 'any_value' })
    token = 'any_token'
  })

  beforeEach(() => {
    sut = new MicrosoftLoginController(microsoftAuth)
  })

  it('should build validators correctly', () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidation('any_token', 'token')
    ])
  })

  it('should call MicrosoftAuthentication with correct params', async () => {
    await sut.handle({ token: 'any_token' })

    expect(microsoftAuth).toHaveBeenCalledWith({ token })
    expect(microsoftAuth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication error', async () => {
    microsoftAuth.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication success', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
