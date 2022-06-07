import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { AuthenticationError } from '@/domain/entities/errors'
import { LoadUserAccountByEmail, SaveUserAccount } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/entities'

type Setup = (
  facebook: LoadFacebookUser,
  userAccountRepo: LoadUserAccountByEmail & SaveUserAccount,
  token: TokenGenerator
) => FacebookAuthentication

type Input = { token: string }
type Output = { accessToken: string }

export type FacebookAuthentication = (params: Input) => Promise<Output>

export const setupFacebookAuthentication: Setup = (facebook, userAccountRepo, token) => async params => {
  const fbData = await facebook.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await userAccountRepo.loadByEmail({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await userAccountRepo.saveWithFacebook(fbAccount)
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }

  throw new AuthenticationError()
}
