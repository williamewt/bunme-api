import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/domain/contracts/repos'
import { PrismaClient } from '@prisma/client'

type LoadInput = LoadUserAccountRepository.Input
type LoadOutput = LoadUserAccountRepository.Output
type SaveFacebookInput = SaveFacebookAccountRepository.Input
type SaveFacebookOutput = SaveFacebookAccountRepository.Output

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  constructor (private readonly client: PrismaClient) {}

  async load ({ email }: LoadInput): Promise<LoadOutput> {
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

  async saveWithFacebook ({ id, name, email, facebookId }: SaveFacebookInput): Promise<SaveFacebookOutput> {
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
