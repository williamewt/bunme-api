import { LoadUserAccountByEmail } from '@/domain/contracts/repos'
import { AccessToken } from '@/domain/entities'
import { HashComparer, TokenGenerator } from '@/domain/contracts/gateways'

import { mock, MockProxy } from 'jest-mock-extended'
import { Authentication, setupAuthentication } from '@/domain/use-cases'

describe('Authentication', () => {
  let userAccountRepo: MockProxy<LoadUserAccountByEmail>
  let hasher: MockProxy<HashComparer>
  let token: MockProxy<TokenGenerator>
  let sut: Authentication

  beforeAll(() => {
    userAccountRepo = mock()
    hasher = mock()
    token = mock()
    userAccountRepo.loadByEmail.mockResolvedValue({
      id: 'any_id',
      name: 'any_name',
      password: 'any_hashed_password'
    })
    hasher.compare.mockResolvedValue(true)
    token.generate.mockResolvedValue('any_token')
  })

  beforeEach(() => {
    sut = setupAuthentication(userAccountRepo, hasher, token)
  })

  it('should calls userAccountRepo.loadByEmail with correct params', async () => {
    await sut({ email: 'any_email@email.com', password: 'any_password' })

    expect(userAccountRepo.loadByEmail).toHaveBeenCalledWith({ email: 'any_email@email.com' })
    expect(userAccountRepo.loadByEmail).toHaveBeenCalledTimes(1)
  })

  it('should calls hasher.compare with correct params', async () => {
    await sut({ email: 'any_email@email.com', password: 'any_password' })

    expect(hasher.compare).toHaveBeenCalledWith({ plaintext: 'any_password', digest: 'any_hashed_password' })
    expect(hasher.compare).toHaveBeenCalledTimes(1)
  })

  it('should calls token.generate with correct params', async () => {
    await sut({ email: 'any_email@email.com', password: 'any_password' })

    expect(token.generate).toHaveBeenCalledWith({ key: 'any_id', expirationInMs: AccessToken.expirationInMs })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  it('Should returns AccessToken on Success', async () => {
    const authOutput = await sut({ email: 'any_email@email.com', password: 'any_password' })

    expect(authOutput).toEqual({ accessToken: 'any_token' })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  it('should return undefined if userAccountRepo.loadByEmail returns undefined', async () => {
    userAccountRepo.loadByEmail.mockResolvedValueOnce(undefined)

    const authenticate = await sut({ email: 'any_email@email.com', password: 'any_password' })

    expect(authenticate).toBeUndefined()
  })

  it('should return undefined if hasher.compare returns false', async () => {
    hasher.compare.mockResolvedValueOnce(false)

    const authenticate = await sut({ email: 'any_email@email.com', password: 'any_password' })

    expect(authenticate).toBeFalsy()
  })

  it('Should rethrow if userAccountRepo.loadByEmail throws', async () => {
    userAccountRepo.loadByEmail.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ email: 'any_email@email.com', password: 'any_password' })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('Should rethrow if hasher.compare throws', async () => {
    hasher.compare.mockRejectedValueOnce(new Error('hasher_error'))

    const promise = sut({ email: 'any_email@email.com', password: 'any_password' })

    await expect(promise).rejects.toThrow(new Error('hasher_error'))
  })
})
