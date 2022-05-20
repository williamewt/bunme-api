import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'
import { CreateGoogleAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'

export class GoogleAuthenticationService {
  constructor (
    private readonly googleApi: LoadGoogleUserApi,
    private readonly userAccountRepo: LoadUserAccountRepository & CreateGoogleAccountRepository
  ) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    const gData = await this.googleApi.loadUser(params)

    if (gData !== undefined) {
      await this.userAccountRepo.load({ email: gData.email })
      await this.userAccountRepo.createFromGoogle(gData)
    }

    return new AuthenticationError()
  }
}
