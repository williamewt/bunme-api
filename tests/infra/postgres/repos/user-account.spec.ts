import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { PrismaClient } from '@prisma/client'
import createPrismaMock from 'prisma-mock'

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository
  let client: PrismaClient

  beforeEach(async () => {
    client = await createPrismaMock()
    sut = new PgUserAccountRepository(client)
  })

  describe('load', () => {
    it('should return a account id if email exists', async () => {
      await client.user.create({
        data: {
          email: 'existing_email'
        }
      })

      const account = await sut.load({ email: 'existing_email' })

      expect(account).toEqual({ id: '1' })
    })

    it('should return undefined if email not exists', async () => {
      await client.user.create({
        data: {
          email: 'existing_email'
        }
      })

      const account = await sut.load({ email: 'not_existing_email' })

      expect(account).toBeUndefined()
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
        id: id,
        name: 'new_name',
        email: 'new_email',
        facebookId: 'new_fb_id'
      })

      const pgUser = await client.user.findUnique({
        where: {
          id: 1
        },
        select: {
          id: true,
          name: true,
          email: true,
          facebookId: true
        }
      })

      expect(pgUser).toEqual({
        id: 1,
        name: 'new_name',
        email: 'any_email',
        facebookId: 'new_fb_id'
      })
      expect(id).toBe('1')
    })
  })

  describe('saveWithGoogle', () => {
    it('should an new account if id is undefined', async () => {
      const { id } = await sut.saveWithGoogle({
        name: 'any_name',
        email: 'any_email',
        googleId: 'any_g_id'
      })

      const pgUser = await sut.load({ email: 'any_email' })

      expect(pgUser?.id).toBe('1')
      expect(id).toBe('1')
    })

    it('should update an account if id is not undefined', async () => {
      const { id } = await sut.saveWithGoogle({
        name: 'any_name',
        email: 'any_email',
        googleId: 'any_g_id'
      })

      await sut.saveWithGoogle({
        id: id,
        name: 'new_name',
        email: 'new_email',
        googleId: 'new_g_id'
      })

      const pgUser = await client.user.findUnique({
        where: {
          id: 1
        },
        select: {
          id: true,
          name: true,
          email: true,
          googleId: true
        }
      })

      expect(pgUser).toEqual({
        id: 1,
        name: 'new_name',
        email: 'any_email',
        googleId: 'new_g_id'
      })
      expect(id).toBe('1')
    })
  })

  describe('saveWithMicrosoft', () => {
    it('should an new account if id is undefined', async () => {
      const { id } = await sut.saveWithMicrosoft({
        name: 'any_name',
        email: 'any_email',
        microsoftId: 'any_m_id'
      })

      const pgUser = await sut.load({ email: 'any_email' })

      expect(pgUser?.id).toBe('1')
      expect(id).toBe('1')
    })

    it('should update an account if id is not undefined', async () => {
      const { id } = await sut.saveWithMicrosoft({
        name: 'any_name',
        email: 'any_email',
        microsoftId: 'any_m_id'
      })

      await sut.saveWithMicrosoft({
        id: id,
        name: 'new_name',
        email: 'new_email',
        microsoftId: 'new_m_id'
      })

      const pgUser = await client.user.findUnique({
        where: {
          id: 1
        },
        select: {
          id: true,
          name: true,
          email: true,
          microsoftId: true
        }
      })

      expect(pgUser).toEqual({
        id: 1,
        name: 'new_name',
        email: 'any_email',
        microsoftId: 'new_m_id'
      })
      expect(id).toBe('1')
    })
  })
})
