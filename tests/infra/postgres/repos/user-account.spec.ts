import { LoadUserAccountRepository } from '@/data/contracts/repos'
import { PrismaClient, User } from '@prisma/client'
import { mockDeep } from 'jest-mock-extended'
import { PrismaClientContext } from '@/data/contracts/contexts'

class PgUserAccountRepository implements LoadUserAccountRepository {
  async load (params: LoadUserAccountRepository.Params, ctx: PrismaClientContext.Context): Promise<LoadUserAccountRepository.Result> {
    const pgUser = await ctx.prisma.user.findUnique({
      where: {
        email: params.email
      },
      select: {
        id: true,
        name: true
      }
    })
    if (pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: (pgUser.name !== null && pgUser.name !== '') ? pgUser.name : undefined
      }
    }
  }
}

describe('PgUserAccountRepository', () => {
  let mockCtx: PrismaClientContext.MockContext
  let ctx: PrismaClientContext.Context
  let userData: User

  beforeAll(() => {
    const date = new Date()
    userData = {
      id: 1n,
      name: '',
      email: 'existing_email',
      cellphone: '',
      password: '',
      facebookId: '',
      googleId: '',
      createdAt: date,
      updatedAt: date
    }
  })

  beforeEach(() => {
    mockCtx = { prisma: mockDeep<PrismaClient>() }
    ctx = mockCtx as unknown as PrismaClientContext.Context
  })
  describe('load', () => {
    it('should return a account if email exists', async () => {
      const sut = new PgUserAccountRepository()

      mockCtx.prisma.user.findUnique.mockResolvedValueOnce(userData)

      const account = await sut.load({ email: 'existing_email' }, ctx)

      expect(account).toEqual({ id: '1' })
    })
  })
})
