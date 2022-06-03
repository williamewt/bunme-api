import { LoadGoogleUser } from '@/domain/contracts/gateways'
import { HttpGetClient, HttpPostClient } from '@/infra/http'

type AppToken = {
  access_token: string
}

type UserInfo = {
  id: string
  name: string
  email: string
}

type Input = LoadGoogleUser.Input
type Output = LoadGoogleUser.Output

export class GoogleApi implements LoadGoogleUser {
  constructor (
    private readonly httpClient: HttpGetClient & HttpPostClient,
    private readonly clientId: string,
    private readonly clientSecret: string,
    private readonly redirectUri: string
  ) { }

  async loadUser ({ code }: Input): Promise<Output> {
    return this.getUserInfo(code)
      .then(({ id, name, email }) => ({ googleId: id, name, email }))
      .catch(() => undefined)
  }

  private async getAppToken (code: string): Promise<AppToken> {
    return this.httpClient.post({
      url: 'https://oauth2.googleapis.com/token',
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        code: code,
        redirect_uri: this.redirectUri,
        grant_type: 'authorization_code'
      }
    })
  }

  private async getUserInfo (code: string): Promise<UserInfo> {
    const AppToken = await this.getAppToken(code)
    return this.httpClient.get({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      config: {
        params: {
          alt: 'json',
          fields: ['id', 'name', 'email'].join(','),
          access_token: AppToken.access_token
        }
      }
    })
  }
}
