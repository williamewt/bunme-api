import { AuthenticationError } from '@/domain/errors'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'
import { mock } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  it('Should call LoadGoogleUserApi with correct params', async () => {
    const loadGoogleUserApi = mock<LoadGoogleUserApi>()

    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const loadGoogleUserApi = mock<LoadGoogleUserApi>()

    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
