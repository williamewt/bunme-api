import { PgCheckDuplicateFieldsRepository } from '@/infra/postgres/repos'
import { PrismaClient } from '@prisma/client'
import createPrismaMock from 'prisma-mock'

describe('PgCheckDuplicateFieldsRepository', () => {
  let sut: PgCheckDuplicateFieldsRepository
  let client: PrismaClient

  beforeAll(async () => {
    client = await createPrismaMock()
    await client.user.create({
      data: {
        name: 'any_name',
        email: 'any_email'
      }
    })
  })
  beforeEach(() => {
    sut = new PgCheckDuplicateFieldsRepository(client)
  })

  it('should calls PgCheckDuplicateFieldsRepository.load with correct params', async () => {
    await sut.load({ table: 'user', fieldName: 'email', value: 'any_email' })

    expect(client.user.findUnique).toHaveBeenCalledWith({
      where: {
        email: 'any_email'
      }
    })
    expect(client.user.findUnique).toHaveBeenCalledTimes(1)
  })

  it('should return true if user exists with email tested', async () => {
    const emailExists = await sut.load({ table: 'user', fieldName: 'email', value: 'any_email' })

    expect(emailExists).toBeTruthy()
  })

  it('should return false if user not exists with email tested', async () => {
    const emailExists = await sut.load({ table: 'user', fieldName: 'email', value: 'other_email' })

    expect(emailExists).toBeFalsy()
  })

  it('should return false if user exists but he has same id of the param', async () => {
    const emailExists = await sut.load({ table: 'user', fieldName: 'email', value: 'any_email', id: 1 })

    expect(emailExists).toBeFalsy()
  })

  it('should return true if user exists and he has not same id of the param', async () => {
    const emailExists = await sut.load({ table: 'user', fieldName: 'email', value: 'any_email', id: 2 })

    expect(emailExists).toBeTruthy()
  })
})
