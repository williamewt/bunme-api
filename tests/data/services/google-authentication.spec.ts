import { AuthenticationError } from '@/domain/errors'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'
import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
  let loadUserAccountRepo: MockProxy<LoadUserAccountRepository>
  let sut: GoogleAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    loadGoogleUserApi = mock()
    loadGoogleUserApi.loadUser.mockResolvedValue({
      name: 'any_g_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
    loadUserAccountRepo = mock()
    sut = new GoogleAuthenticationService(
      loadGoogleUserApi,
      loadUserAccountRepo
    )
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

  it('Should call LoadUserAccountRepo when LoadGoogleUserApi returns data', async () => {
    await sut.perform({ token })

    expect(loadUserAccountRepo.load).toHaveBeenCalledWith({ email: 'any_g_email' })
    expect(loadUserAccountRepo.load).toHaveBeenCalledTimes(1)
  })
})
