import { AuthenticationError } from '@/domain/entities/errors'
import { GoogleLoginController } from '@/application/controllers'
import { UnauthorizedError } from '@/application/errors'
import { RequiredStringValidation } from '@/application/validation'

describe('GoogleLoginController', () => {
  let googleAuth: jest.Mock
  let sut: GoogleLoginController
  let code: string

  beforeAll(() => {
    googleAuth = jest.fn()
    googleAuth.mockResolvedValue({ accessToken: 'any_value' })
    code = 'any_code'
  })

  beforeEach(() => {
    sut = new GoogleLoginController(googleAuth)
  })

  it('should build validators correctly', () => {
    const validators = sut.buildValidators({ code })

    expect(validators).toEqual([
      new RequiredStringValidation('any_code', 'code')
    ])
  })

  it('should call GoogleAuthentication with correct params', async () => {
    await sut.handle({ code: 'any_code' })

    expect(googleAuth).toHaveBeenCalledWith({ code })
    expect(googleAuth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if authentication error', async () => {
    googleAuth.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ code })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if authentication success', async () => {
    const httpResponse = await sut.handle({ code })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
