import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'

describe('GoogleAuthenticationService', () => {
  it('Should call LoadGoogleUserApi with correct params', async () => {
    const loadGoogleUserApi = {
      loadUser: jest.fn()
    }

    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const loadGoogleUserApi = {
      loadUser: jest.fn()
    }

    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
