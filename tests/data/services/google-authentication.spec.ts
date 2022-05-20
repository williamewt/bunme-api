import { AuthenticationError } from '@/domain/errors'
import { LoadGoogleUserApi } from '@/data/contracts/apis'
import { GoogleAuthenticationService } from '@/data/contracts/apis/services'
import { mock, MockProxy } from 'jest-mock-extended'

type SutTypes = {
  sut: GoogleAuthenticationService
  loadGoogleUserApi: MockProxy<LoadGoogleUserApi>
}

const makeSut = (): SutTypes => {
  const loadGoogleUserApi = mock<LoadGoogleUserApi>()
  const sut = new GoogleAuthenticationService(loadGoogleUserApi)

  return {
    sut,
    loadGoogleUserApi
  }
}

describe('GoogleAuthenticationService', () => {
  it('Should call LoadGoogleUserApi with correct params', async () => {
    const { sut, loadGoogleUserApi } = makeSut()
    await sut.perform({ token: 'any_token' })

    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(loadGoogleUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('Should return AuthenticationError when LoadGoogleUserApi returns undefined', async () => {
    const { sut, loadGoogleUserApi } = makeSut()

    loadGoogleUserApi.loadUser.mockResolvedValueOnce(undefined)

    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })
})
