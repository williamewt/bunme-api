import { mock, MockProxy } from 'jest-mock-extended'

export interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>
}

export namespace TokenValidator {
  export type Params = {token: string}
}

type Setup = (crypto: TokenValidator) => Authorize
type Input = { token: string }
// type Output = { accessToken: string }
type Authorize = (params: Input) => Promise<void>

const setupAuhthorize: Setup = crypto => async params => {
  await crypto.validateToken(params)
}

describe('Authorize', () => {
  let crypto: MockProxy<TokenValidator>
  let sut: Authorize
  let token: string

  beforeAll(() => {
    token = 'any_token'
    crypto = mock()
  })

  beforeEach(() => {
    sut = setupAuhthorize(crypto)
  })

  it('Should call TokenValidator with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
