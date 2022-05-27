import { User } from '@/domain/models'
import { PgUserAccountRepositoryInMemmory } from '@/tests/infra/postgres/in_memmory'

describe('PgUserAccountRepositoryInMemmory', () => {
  let sut: PgUserAccountRepositoryInMemmory
  let userData: User

  beforeAll(() => {
    userData = {
      id: 1n,
      email: 'existing_email'
    }
  })

  beforeEach(() => {
    sut = new PgUserAccountRepositoryInMemmory()
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
    it('should an new account if id is undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_fb_id'
      })

      const pgUser = await sut.load({ email: 'any_email' })

      expect(pgUser?.id).toBe('1')
      expect(id).toBe('1')
    })

    it('should update an account if id is not undefined', async () => {
      const { id } = await sut.saveWithFacebook({
        name: 'any_name',
        email: 'any_email',
        facebookId: 'any_fb_id'
      })

      await sut.saveWithFacebook({
        id: '1',
        name: 'new_name',
        email: 'new_email',
        facebookId: 'new_fb_id'
      })

      const pgUser = sut.items.find(user => user.id === 1n)

      expect(pgUser).toEqual({
        id: 1n,
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })
})
