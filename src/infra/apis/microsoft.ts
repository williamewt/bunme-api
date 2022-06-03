import { LoadMicrosoftUser } from '@/domain/contracts/gateways'
import { HttpGetClient } from '@/infra/http'

type UserInfo = {
  id: string
  displayName: string
  email: string
}

type Input = LoadMicrosoftUser.Input
type Output = LoadMicrosoftUser.Output

export class MicrosoftApi {
  constructor (
    private readonly httpClient: HttpGetClient
  ) { }

  async loadUser ({ token }: Input): Promise<Output> {
    return this.getUserInfo(token)
      .then(({ id, displayName, email }) => ({ microsoftId: id, name: displayName, email }))
      .catch(() => undefined)
  }

  private async getUserInfo (token: string): Promise<UserInfo> {
    return this.httpClient.get({
      url: 'https://graph.microsoft.com/v1.0/me/',
      config: {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    })
  }
}
