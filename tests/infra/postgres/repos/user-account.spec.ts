import { User } from '@/domain/models'
import { PgUserAccountRepository } from '@/tests/infra/postgres/inmemmory'

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

  describe('saveWithFacebook', () => {
    it('should an account if id is undefined', async () => {
      const account = await sut.saveWithFacebook({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_fb_id'
      })

      expect(account).toEqual({ id: '1' })
    })
  })
})
