import { LoadMicrosoftUser, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos'
import { AccessToken, MicrosoftAccount } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Setup = (
  microsoft: LoadMicrosoftUser,
  userAccountRepo: LoadUserAccount & SaveUserAccount,
  token: TokenGenerator

) => MicrosoftAuthentication

type Input = { token: string }
type Output = { accessToken: string }

export type MicrosoftAuthentication = (params: Input) => Promise<Output>

export const setupMicrosoftAuthentication: Setup = (microsoft, userAccountRepo, token) => async params => {
  const mUser = await microsoft.loadUser(params)
  if (mUser !== undefined) {
    const accountData = await userAccountRepo.load({ email: mUser.email })
    const mAccount = new MicrosoftAccount(mUser, accountData)
    const { id } = await userAccountRepo.saveWithMicrosoft(mAccount)
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
