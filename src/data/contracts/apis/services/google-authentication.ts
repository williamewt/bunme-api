import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { CreateGoogleAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'

export class GoogleAuthenticationService {
  constructor (
    private readonly loadGoogleUserApi: LoadGoogleUserApi,
    private readonly loadUserAccountRepo: LoadUserAccountRepository,
    private readonly createGoogleAccountRepo: CreateGoogleAccountRepository
  ) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const gData = await this.loadGoogleUserApi.loadUser(params)

    if (gData !== undefined) {
      await this.loadUserAccountRepo.load({ email: gData.email })
      await this.createGoogleAccountRepo.createFromGoogle(gData)
    }

    return new AuthenticationError()
  }
}
