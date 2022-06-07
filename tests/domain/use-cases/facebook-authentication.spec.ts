import { AuthenticationError } from '@/domain/entities/errors'
import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { setupFacebookAuthentication, FacebookAuthentication } from '@/domain/use-cases'
import { LoadUserAccountByEmail, SaveUserAccount } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/entities/facebook-account')

describe('FacebookAuthentication', () => {
  let facebook: MockProxy<LoadFacebookUser>
  let crypto: MockProxy<TokenGenerator>
  let userAccountRepo: MockProxy<LoadUserAccountByEmail & SaveUserAccount>
  let sut: FacebookAuthentication
  let token: string

  beforeAll(() => {
    token = 'any_token'
    facebook = mock()
    facebook.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    userAccountRepo = mock()
    userAccountRepo.loadByEmail.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })
    crypto = mock()
    crypto.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebook,
      userAccountRepo,
      crypto
    )
  })

  it('Should call LoadFacebookUser with correct params', async () => {
    await sut({ token })

    expect(facebook.loadUser).toHaveBeenCalledWith({ token })
    expect(facebook.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should throw AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebook.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('Should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
    await sut({ token })

    expect(userAccountRepo.loadByEmail).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })

  it('Should call SaveFacebookAccount with FacebookAccount', async () => {
    jest.mocked(FacebookAccount).mockImplementation(jest.fn().mockImplementation(() => ({ any: 'any' })))

    await sut({ token })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({ any: 'any' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('Should call TokenGenerator with Correct params', async () => {
    await sut({ token })

    expect(crypto.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })

  it('Should returns AccessToken on Success', async () => {
    const authOutput = await sut({ token })

    expect(authOutput).toEqual({ accessToken: 'any_generated_token' })
    expect(crypto.generate).toHaveBeenCalledTimes(1)
  })

  it('Should rethrow if LoadFacebookUser throws', async () => {
    facebook.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('Should rethrow if LoadUserAccountByEmail throws', async () => {
    userAccountRepo.loadByEmail.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow if SaveFacebookAccount throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('Should rethrow if TokenGenerator throws', async () => {
    crypto.generate.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut({ token })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
