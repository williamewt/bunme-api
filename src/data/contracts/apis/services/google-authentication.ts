import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { AuthenticationError } from '@/domain/errors'
import { GoogleAuthentication } from '@/domain/features'

export class GoogleAuthenticationService {
  constructor (
    private readonly loadGoogleUserApi: LoadGoogleUserApi
  ) { }

  async perform (params: GoogleAuthentication.Params): Promise<AuthenticationError> {
    await this.loadGoogleUserApi.loadUser(params)

    return new AuthenticationError()
  }
}
