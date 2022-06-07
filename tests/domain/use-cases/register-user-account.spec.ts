import { CheckDuplicateFields, SaveUserAccount } from '@/domain/contracts/repos'
import { TokenGenerator, Hasher } from '@/domain/contracts/gateways'
import { AccessToken } from '@/domain/entities'

import { mock, MockProxy } from 'jest-mock-extended'
import { RegisterUserAccount, setupRegisterUserAccount } from '@/domain/use-cases'

describe('RegisterUserAccount', () => {
  let sut: RegisterUserAccount
  let checkDuplicateFieldRepo: MockProxy<CheckDuplicateFields>
  let userAccountRepo: MockProxy<SaveUserAccount>
  let hasher: MockProxy<Hasher>
  let token: MockProxy<TokenGenerator>
  let userData: { name: string, email: string, password: string }

  beforeAll(() => {
    checkDuplicateFieldRepo = mock()
    checkDuplicateFieldRepo.load.mockResolvedValue(false)
    userAccountRepo = mock()
    hasher = mock()
    userAccountRepo.save.mockResolvedValue({ id: 'any_id' })
    hasher.hash.mockResolvedValue('any_hash')
    token = mock()
    userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
  })

  beforeEach(() => {
    sut = setupRegisterUserAccount(checkDuplicateFieldRepo, userAccountRepo, hasher, token)
  })

  it('should calls checkDuplicateFieldRepo.load with correct params', async () => {
    await sut(userData)

    expect(checkDuplicateFieldRepo.load).toHaveBeenCalledWith({
      table: 'user',
      fieldName: 'email',
      value: 'any_email'
    })
    expect(checkDuplicateFieldRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should calls hasher.hash with correct params', async () => {
    await sut(userData)

    expect(hasher.hash).toHaveBeenCalledWith({ plaintext: userData.password })
    expect(hasher.hash).toHaveBeenCalledTimes(1)
  })

  it('should calls userAccountRepo.save with correct params', async () => {
    await sut(userData)

    expect(userAccountRepo.save).toHaveBeenCalledWith({ ...userData, password: 'any_hash' })
    expect(userAccountRepo.save).toHaveBeenCalledTimes(1)
  })

  it('should calls token.generate with correct params', async () => {
    await sut(userData)

    expect(token.generate).toHaveBeenCalledWith({ key: 'any_id', expirationInMs: AccessToken.expirationInMs })
    expect(token.generate).toHaveBeenCalledTimes(1)
  })

  it('should return undefined if checkDuplicateFieldRepo.load returns true', async () => {
    checkDuplicateFieldRepo.load.mockResolvedValueOnce(true)

    const accountUser = await sut(userData)

    expect(accountUser).toBeUndefined()
  })

  it('Should rethrow if userAccountRepo.save throws', async () => {
    userAccountRepo.save.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut(userData)

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })
})
