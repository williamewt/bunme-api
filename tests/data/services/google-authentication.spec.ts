import { AuthenticationError } from '@/domain/errors'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let sut: GoogleAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadGoogleUserApi = mock()
    sut = new GoogleAuthenticationService(loadGoogleUserApi)
  })

  it('Should call LoadGoogleUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
