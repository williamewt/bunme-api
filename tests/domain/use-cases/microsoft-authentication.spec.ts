import { mock, MockProxy } from 'jest-mock-extended'
import { AuthenticationError } from '@/domain/entities/errors'
import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { AccessToken, MicrosoftAccount } from '@/domain/entities'
import { LoadMicrosoftUser, TokenGenerator } from '@/domain/contracts/gateways'
import { MicrosoftAuthentication, setupMicrosoftAuthentication } from '@/domain/use-cases'

jest.mock('@/domain/entities/microsoft-account')

describe('MicrosoftAuthentication', () => {
  let microsoft: MockProxy<LoadMicrosoftUser>
  let userAccountRepo: MockProxy<LoadUserAccount & SaveUserAccount>
  let token: string
  let sut: MicrosoftAuthentication
  let crypto: MockProxy<TokenGenerator>

  beforeAll(() => {
    token = 'any_token'
    microsoft = mock()
    microsoft.loadUser.mockResolvedValue({
      name: 'any_m_name',
      email: 'any_m_email',
      microsoftId: 'any_m_id'
    })
    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithMicrosoft.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupMicrosoftAuthentication(
      microsoft,
      userAccountRepo,
      crypto
    )
  })

  it('Should call LoadMicrosoftUser with correct params', async () => {
    await sut({ token })

    expect(microsoft.loadUser).toHaveBeenCalledWith({ token })
    expect(microsoft.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should throw AuthenticationError when LoadMicrosoftUser returns undefined', async () => {
    microsoft.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadMicrosoftUser returns data', async () => {
    await sut({ token })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_m_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveUserAccount with MicrosoftAccount', async () => {
    jest.mocked(MicrosoftAccount).mockImplementation(jest.fn().mockImplementation(() => ({ any: 'any' })))

    await sut({ token })

    expect(userAccountRepo.saveWithMicrosoft).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithMicrosoft).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with Correct params', async () => {
    await sut({ token })

    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })

  it('Should rethrow if LoadMicrosoftUser throws', async () => {
    microsoft.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('Should rethrow if LoadUserAccount throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow if SaveMicrosoftAccount throws', async () => {
    userAccountRepo.saveWithMicrosoft.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
