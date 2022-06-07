import { LoadUserAccountByEmail } from '@/domain/contracts/repos'
import { AccessToken } from '@/domain/entities'
import { HashComparer, TokenGenerator } from '@/domain/contracts/gateways'

type Setup = (
  userAccountRepo: LoadUserAccountByEmail,
  hasher: HashComparer,
  token: TokenGenerator
) => Authentication

type Input = { email: string, password: string }
type Output = { accessToken: string } | undefined

export type Authentication = (params: Input) => Promise<Output>

export const setupAuthentication: Setup = (userAccountRepo, hasher, token) => async params => {
  const pgUser = await userAccountRepo.loadByEmail({ email: params.email })
  if (pgUser !== undefined) {
    const passwordIsValid = await hasher.compare({ plaintext: params.password, digest: pgUser.password as string })
    if (passwordIsValid) {
      const accessToken = await token.generate({ key: pgUser.id, expirationInMs: AccessToken.expirationInMs })
      return { accessToken }
    }
  }
}
