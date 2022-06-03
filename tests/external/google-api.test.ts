import { GoogleApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Google Api Integration Tests', () => {
  let sut: GoogleApi
  let axiosClient: AxiosHttpClient

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new GoogleApi(
      axiosClient,
      env.googleApi.clientId,
      env.googleApi.clientSecret,
      env.googleApi.redirectUri
    )
  })

  it('should return a Google user is code is valid', async () => {
    const gUser = await sut.loadUser({ code: env.googleApi.codeTest })

    expect(gUser).toBeDefined()
  })

  it('should return undefined is code is invalid', async () => {
    const gUser = await sut.loadUser({ code: 'invalid_code' })

    expect(gUser).toBeUndefined()
  })
})
