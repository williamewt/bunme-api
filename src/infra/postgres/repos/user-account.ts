import { LoadUserAccountByEmail, SaveUserAccount } from '@/domain/contracts/repos'
import { PrismaClient } from '@prisma/client'

type LoadInput = LoadUserAccountByEmail.Input
type LoadOutput = LoadUserAccountByEmail.Output
type SaveUserInput = SaveUserAccount.Input
type SaveUserOutput = SaveUserAccount.Output

export class PgUserAccountRepository implements LoadUserAccountByEmail, SaveUserAccount {
  constructor (private readonly client: PrismaClient) {}

  async loadByEmail ({ email }: LoadInput): Promise<LoadOutput> {
    const pgUser = await this.client.user.findUnique({
      where: {
        email: email
      },
      select: {
        id: true,
        name: true,
        password: true
      }
    })
    if (pgUser !== null) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
        password: pgUser.password ?? undefined
      }
    }
  }

  async save ({ name, email, password }: SaveUserInput): Promise<SaveUserOutput> {
    const pgUser = await this.client.user.create({
      data: { name, email, password }
    })
    return { id: pgUser.id.toString() }
  }

  async saveWithFacebook ({ id, name, email, facebookId }: SaveUserInput): Promise<SaveUserOutput> {
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

  async saveWithGoogle ({ id, name, email, googleId }: SaveUserInput): Promise<SaveUserOutput> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.client.user.create({
        data: { name, email, googleId }
      })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await this.client.user.update({
        where: { id: parseInt(id) },
        data: { name, googleId }
      })
    }
    return { id: resultId }
  }

  async saveWithMicrosoft ({ id, name, email, microsoftId }: SaveUserInput): Promise<SaveUserOutput> {
    let resultId: string
    if (id === undefined) {
      const pgUser = await this.client.user.create({
        data: { name, email, microsoftId }
      })
      resultId = pgUser.id.toString()
    } else {
      resultId = id
      await this.client.user.update({
        where: { id: parseInt(id) },
        data: { name, microsoftId }
      })
    }
    return { id: resultId }
  }
}
