
import { mock, MockProxy } from 'jest-mock-extended'

import { HttpGetClient } from '@/infra/http'
import { MicrosoftApi } from '@/infra/apis'

describe('MicrosoftApi', () => {
  let httpClient: MockProxy<HttpGetClient>
  let sut: MicrosoftApi

  beforeAll(() => {
    httpClient = mock()
  })

  beforeEach(() => {
    sut = new MicrosoftApi(httpClient)
    httpClient.get.mockResolvedValue({ id: 'any_m_id', displayName: 'any_m_name', email: 'any_m_email' })
  })

  it('Should get user info', async () => {
    await sut.loadUser({ token: 'any_client_code' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.microsoft.com/v1.0/me/',
      config: {
        headers: {
          Authorization: 'Bearer any_client_code'
        }
      }
    })
  })

  it('Should get microsoft user info', async () => {
    const mUser = await sut.loadUser({ token: 'any_client_code' })

    expect(mUser).toEqual({
      microsoftId: 'any_m_id',
      name: 'any_m_name',
      email: 'any_m_email'
    })
  })

  it('Should return undefined if HttpGetClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('get_error'))

    const mUser = await sut.loadUser({ token: 'any_client_code' })

    expect(mUser).toBeUndefined()
  })
})
