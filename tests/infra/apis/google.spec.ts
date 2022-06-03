
import { mock, MockProxy } from 'jest-mock-extended'

import { HttpGetClient, HttpPostClient } from '@/infra/http'
import { GoogleApi } from '@/infra/apis'

describe('GoogleApi', () => {
  let clientId: string
  let clientSecret: string
  let redirectUri: string
  let httpClient: MockProxy<HttpGetClient & HttpPostClient>
  let sut: GoogleApi

  beforeAll(() => {
    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    redirectUri = 'any_redirect_uri'
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new GoogleApi(httpClient, clientId, clientSecret, redirectUri)
    httpClient.post.mockResolvedValueOnce({ access_token: 'any_app_token' })
    httpClient.get.mockResolvedValueOnce({ id: 'any_g_id', name: 'any_g_name', email: 'any_g_email' })
  })

  it('Should get app token', async () => {
    await sut.loadUser({ code: 'any_client_code' })

    expect(httpClient.post).toHaveBeenCalledWith({
      url: 'https://oauth2.googleapis.com/token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        code: 'any_client_code',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      }
    })
  })

  it('Should get user info', async () => {
    await sut.loadUser({ code: 'any_client_code' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      config: {
        params: {
          alt: 'json',
          fields: ['id', 'name', 'email'].join(','),
          access_token: 'any_app_token'
        }
      }
    })
  })

  it('Should get google user info', async () => {
    const gUser = await sut.loadUser({ code: 'any_client_code' })

    expect(gUser).toEqual({
      googleId: 'any_g_id',
      name: 'any_g_name',
      email: 'any_g_email'
    })
  })

  it('Should return undefined if HttpGetClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('get_error'))

    const gUser = await sut.loadUser({ code: 'any_client_code' })

    expect(gUser).toBeUndefined()
  })

  it('Should return undefined if HttpPostClient throws', async () => {
    httpClient.post.mockReset().mockRejectedValueOnce(new Error('post_error'))

    const gUser = await sut.loadUser({ code: 'any_client_code' })

    expect(gUser).toBeUndefined()
  })
})
