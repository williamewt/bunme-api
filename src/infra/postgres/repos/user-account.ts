import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { prisma } from '@/main/database'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveFacebookParams = SaveFacebookAccountRepository.Params
type SaveFacebookResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = await prisma.user.findUnique({
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
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookParams): Promise<SaveFacebookResult> {
    let id: string
    if (params.id === undefined) {
      const pgUser = await prisma.user.create({
        data: {
          name: params.name,
          email: params.email,
          facebookId: params.facebookId
        }
      })
      id = pgUser.id.toString()
    } else {
      id = params.id
      await prisma.user.update({
        where: {
          id: BigInt(id)
        },
        data: {
          name: params.name,
          facebookId: params.facebookId
        }
      })
    }
    return { id }
  }
}
