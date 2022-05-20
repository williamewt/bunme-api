import { AuthenticationError } from '@/domain/errors'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'

class LoadGoogleUserApiSpy implements LoadGoogleUserApi {
  token?: string
  callsCount = 0
  result = undefined
  async loadUser (params: LoadGoogleUserApi.Params): Promise<LoadGoogleUserApi.Result> {
    this.token = params.token
    this.callsCount++
    return this.result
  }
}

describe('GoogleAuthenticationService', () => {
  it('Should call LoadGoogleUserApi with correct params', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    await sut.perform({ token: 'any_token' })

    expect(loadGoogleUserApi.token).toBe('any_token')
    expect(loadGoogleUserApi.callsCount).toBe(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const loadGoogleUserApi = new LoadGoogleUserApiSpy()
    loadGoogleUserApi.result = undefined
    const sut = new GoogleAuthenticationService(loadGoogleUserApi)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
