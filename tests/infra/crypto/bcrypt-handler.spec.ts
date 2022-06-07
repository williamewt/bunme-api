import bcrypt from 'bcrypt'
import { BcryptHandler } from '@/infra/crypto'

jest.mock('bcrypt')

describe('', () => {
  let sut: BcryptHandler
  let fakeBcrypt: jest.Mocked<typeof bcrypt>
  let salt: number
  let hash: string
  let password: string

  beforeAll(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>
    salt = 12
    hash = 'any_hash'
    password = 'any_password'
  })

  beforeEach(() => {
    sut = new BcryptHandler(salt)
  })

  describe('hash', () => {
    beforeAll(() => {
      fakeBcrypt.hash.mockImplementation(() => hash)
    })

    it('should call with correct params', async () => {
      await sut.hash({ plaintext: password })

      expect(fakeBcrypt.hash).toHaveBeenCalledWith(password, salt)
      expect(fakeBcrypt.hash).toHaveBeenCalledTimes(1)
    })

    it('should returns a hash', async () => {
      const generatedHash = await sut.hash({ plaintext: password })

      expect(generatedHash).toBe(hash)
    })

    it('should rethrow if get throws', async () => {
      fakeBcrypt.hash.mockImplementationOnce(() => { throw new Error('hash_error') })

      const promise = sut.hash({ plaintext: password })

      await expect(promise).rejects.toThrow(new Error('hash_error'))
    })
  })

  describe('compare', () => {
    let password: string

    beforeAll(() => {
      password = 'any_password'
      fakeBcrypt.compare.mockImplementation(() => true)
    })

    it('should call with correct params', async () => {
      await sut.compare({ plaintext: password, digest: hash })

      expect(fakeBcrypt.compare).toHaveBeenCalledWith(password, hash)
      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1)
    })

    it('should returns false if password is incorrect', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => false)

      const isPasswordCorrect = await sut.compare({ plaintext: 'other_password', digest: hash })

      expect(isPasswordCorrect).toBeFalsy()
    })

    it('should returns true if password is incorrect', async () => {
      const isPasswordCorrect = await sut.compare({ plaintext: password, digest: hash })

      expect(isPasswordCorrect).toBeTruthy()
    })

    it('should rethrow if get throws', async () => {
      fakeBcrypt.compare.mockImplementationOnce(() => { throw new Error('compare_error') })

      const promise = sut.compare({ plaintext: password, digest: hash })

      await expect(promise).rejects.toThrow(new Error('compare_error'))
    })
  })
})
