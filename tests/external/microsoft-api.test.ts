import { MicrosoftApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Microsoft Api Integration Tests', () => {
  let sut: MicrosoftApi
  let axiosClient: AxiosHttpClient

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new MicrosoftApi(axiosClient)
  })

  it('should return a Microsoft user is code is valid', async () => {
    const gUser = await sut.loadUser({ token: env.microsoftApi.tokenTest })

    expect(gUser).toBeDefined()
  })

  it('should return undefined is code is invalid', async () => {
    const gUser = await sut.loadUser({ token: 'invalid_token' })

    expect(gUser).toBeUndefined()
  })
})
