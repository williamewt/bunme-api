import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/entities/errors'
import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { GoogleAccount, AccessToken } from '@/domain/entities'
import { LoadGoogleUser, TokenGenerator } from '@/domain/contracts/gateways'
import { GoogleAuthentication, setupGoogleAuthentication } from '@/domain/use-cases'

jest.mock('@/domain/entities/google-account')

describe('GoogleAuthentication', () => {
  let google: MockProxy<LoadGoogleUser>
  let userAccountRepo: MockProxy<LoadUserAccount & SaveUserAccount>
  let code: string
  let sut: GoogleAuthentication
  let crypto: MockProxy<TokenGenerator>

  beforeAll(() => {
    code = 'any_code'
    google = mock()
    google.loadUser.mockResolvedValue({
      name: 'any_g_name',
      email: 'any_g_email',
      googleId: 'any_g_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithGoogle.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupGoogleAuthentication(
      google,
      userAccountRepo,
      crypto
    )
  })

  it('Should call LoadGoogleUser with correct params', async () => {
    await sut({ code })

    expect(google.loadUser).toHaveBeenCalledWith({ code })
    expect(google.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should throw AuthenticationError when LoadGoogleUser returns undefined', async () => {
    google.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ code })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadGoogleUser returns data', async () => {
    await sut({ code })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_g_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserAccount with GoogleAccount', async () => {
    jest.mocked(GoogleAccount).mockImplementation(jest.fn().mockImplementation(() => ({ any: 'any' })))

    await sut({ code })

    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithGoogle).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with Correct params', async () => {
    await sut({ code })

    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })

  it('Should rethrow if LoadGoogleUser throws', async () => {
    google.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut({ code })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('Should rethrow if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ code })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow if SaveGoogleAccount throws', async () => {
    userAccountRepo.saveWithGoogle.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ code })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('code_error'))

    const promise = sut({ code })

    await expect(promise).rejects.toThrow(new Error('code_error'))
  })
})
