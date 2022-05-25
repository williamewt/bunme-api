import { User } from '@/domain/models'
import { PgUserAccountRepository } from '@/data/contracts/repos/inmemmory'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let userData: User

  beforeAll(() => {
    userData = {
      id: 1n,
      email: 'existing_email'
    }
  })

  beforeEach(() => {
    sut = new PgUserAccountRepository()
    sut.items = []
  })
  describe('load', () => {
    it('should return a account id if email exists', async () => {
      sut.items.push(userData)

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email not exists', async () => {
      sut.items.push(userData)

      const account = await sut.load({ email: 'not_existing_email' })

      expect(account).toEqual(undefined)
    })
  })
})
