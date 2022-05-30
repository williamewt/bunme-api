import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { PrismaClient } from '@prisma/client'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveFacebookParams = SaveFacebookAccountRepository.Params
type SaveFacebookResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  constructor (private readonly client: PrismaClient) {}

  async load ({ email }: LoadParams): Promise<LoadResult> {
    const pgUser = await this.client.user.findUnique({
      where: {
        email: email
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

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookParams): Promise<SaveFacebookResult> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.client.user.create({
        data: { name, email, facebookId }
      })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await this.client.user.update({
        where: { id: parseInt(id) },
        data: { name, facebookId }
      })
    }
    return { id: resultId }
  }
}
