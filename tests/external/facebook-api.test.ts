import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  it('should return a Facebook user is token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const fbUser = await sut.loadUser({ token: 'EAANrzEke38IBAGRGTsZCq6cU7HvwHBi81PBH6hJLhVwCtNwKHZBUkxynDKp1KAl0OPUqdRfdWvE0tI9L4tX9ZC3LbFiayNEABkgCAjPpf76baHrh0ZBS8p8lYnTUpCAbCKgR5hDomWqgloykQIQa20MiMCruvakcTaCZBYH6d3A7Mdkh3ByjG5nd8DUtuCc1ZB7VaLCn7V2gZDZD' })

    expect(fbUser).toEqual({
      facebookId: '100336172709758',
      email: 'karen_cdqwokb_testadora@tfbnw.net',
      name: 'Karen Testadora'
    })
  })

  it('should return undefined is token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
