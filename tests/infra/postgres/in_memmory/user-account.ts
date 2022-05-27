import { LoadUserAccountRepository, SaveFacebookAccountRepository } from '@/data/contracts/repos'
import { User } from '@/domain/models'

type LoadParams = LoadUserAccountRepository.Params
type LoadResult = LoadUserAccountRepository.Result
type SaveFacebookParams = SaveFacebookAccountRepository.Params
type SaveFacebookResult = SaveFacebookAccountRepository.Result

export class PgUserAccountRepositoryInMemmory implements LoadUserAccountRepository, SaveFacebookAccountRepository {
  public items: User[] = []

  async load (params: LoadParams): Promise<LoadResult> {
    const pgUser = this.items.find(user => user.email === params.email)

    if (pgUser !== undefined) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined
      }
    }
  }

  async saveWithFacebook (params: SaveFacebookParams): Promise<SaveFacebookResult> {
    let id: bigint
    if (params.id === undefined) {
      id = BigInt(this.items.length + 1)
      this.items.push({
        id,
        name: params.name,
        email: params.email,
        facebookId: params.facebookId
      })
    } else {
      id = BigInt(params.id)
      const itemIndex = this.items.findIndex(user => user.id === id)
      this.items[itemIndex].name = params.name
      this.items[itemIndex].facebookId = params.facebookId
    }
    return { id: id.toString() }
  }
}
