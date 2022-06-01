import { LoadGoogleUser, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { AccessToken, GoogleAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Setup = (
  google: LoadGoogleUser,
  userAccountRepo: LoadUserAccount & SaveUserAccount,
  token: TokenGenerator
) => GoogleAuthentication

type Input = { code: string }
type Output = { accessToken: string }

export type GoogleAuthentication = (params: Input) => Promise<Output>

export const setupGoogleAuthentication: Setup = (google, userAccountRepo, token) => async params => {
  const gData = await google.loadUser(params)
  if (gData !== undefined) {
    const accountData = await userAccountRepo.load({ email: gData.email })
    const gAccount = new GoogleAccount(gData, accountData)
    const { id } = await userAccountRepo.saveWithGoogle(gAccount)
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }

  throw new AuthenticationError()
}
