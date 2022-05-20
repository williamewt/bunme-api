import { AuthenticationError } from '@/domain/errors'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'
import { CreateGoogleAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { mock, MockProxy } from 'jest-mock-extended'

describe('GoogleAuthenticationService', () => {
  let googleApi: MockProxy<LoadGoogleUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository & CreateGoogleAccountRepository>
  let sut: GoogleAuthenticationService
  const token = 'any_token'

  beforeEach(() => {
    googleApi = mock()
    googleApi.loadUser.mockResolvedValue({
      name: 'any_g_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
    userAccountRepo = mock()
    sut = new GoogleAuthenticationService(
      googleApi,
      userAccountRepo
    )
  })

  it('Should call LoadGoogleUserApi with correct params', async () => {
    await sut.perform({ token })

    expect(googleApi.loadUser).toHaveBeenCalledWith({ token })
    expect(googleApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    googleApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadGoogleUserApi returns data', async () => {
    await sut.perform({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_g_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call CreateUserAccountRepo when LoadGoogleUserApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token })

    expect(userAccountRepo.createFromGoogle).toHaveBeenCalledWith({
      name: 'any_g_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
    expect(userAccountRepo.createFromGoogle).toHaveBeenCalledTimes(1)
  })
})
