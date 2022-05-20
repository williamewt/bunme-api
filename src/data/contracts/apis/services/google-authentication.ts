import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { LoadUserAccountRepository } from '@/data/contracts/repos'

export class GoogleAuthenticationService {
  constructor (
    private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository
  ) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const gData = await this.loadGoogleUserApi.loadUser(params)

    if (gData !== undefined) {
      await this.loadUserAccountRepo.load({ email: gData.email })
    }

    return new AuthenticationError()
  }
}
