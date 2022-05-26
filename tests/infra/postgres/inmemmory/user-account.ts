import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { User } from '@/domain/models'

export class PgUserAccountRepository implements LoadUserAccountRepository {
  public items: User[] = []

  async load (params: LoadUserAccountRepository.Params): Promise<LoadUserAccountRepository.Result> {
    const pgUser = this.items.find(user => user.email === params.email)

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: (pgUser.name !== null && pgUser.name !== '') ? pgUser.name : undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<void> {
    if (params.id === undefined) {
      const id = BigInt(this.items.length + 1)
      this.items.push({
        id,
        name: params.name,
        email: params.email,
        facebookId: params.facebookId
      })
    } else {
      const id = BigInt(params.id)
      const itemIndex = this.items.findIndex(user => user.id === id)
      this.items[itemIndex].name = params.name
      this.items[itemIndex].facebookId = params.facebookId
    }
  }
}
