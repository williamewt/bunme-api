
import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let sut: FacebookApi
  let axiosClient: AxiosHttpClient

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook user is token is valid', async () => {
    const fbUser = await sut.loadUser({ token: env.facebookApi.tokenTest })

    expect(fbUser).toEqual({
      facebookId: '100336172709758',
      email: 'karen_cdqwokb_testadora@tfbnw.net',
      name: 'Karen Testadora'
    })
  })

  it('should return undefined is token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
