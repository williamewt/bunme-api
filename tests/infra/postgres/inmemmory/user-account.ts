import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { User } from '@/domain/models'

export class PgUserAccountRepository implements LoadUserAccountRepository, SaveFacebookAccountRepository {
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

  async saveWithFacebook (params: SaveFacebookAccountRepository.Params): Promise<SaveFacebookAccountRepository.Result> {
    const id = BigInt(this.items.length + 1)
    this.items.push({
      id,
      name: params.name,
      email: params.email,
      facebookId: params.facebookId
    })

    return { id: id.toString() }
  }
}
