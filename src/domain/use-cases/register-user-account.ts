import { Hasher, TokenGenerator } from '@/domain/contracts/gateways'
import { CheckDuplicateFields, SaveUserAccount } from '@/domain/contracts/repos'
import { AccessToken } from '@/domain/entities'

type Setup = (
  checkDuplicateFieldRepo: CheckDuplicateFields,
  userAccountRepo: SaveUserAccount,
  hasher: Hasher,
  token: TokenGenerator
) => RegisterUserAccount

type Input = { name: string, email: string, password: string }
type Output = { accessToken: string } | undefined

export type RegisterUserAccount = (params: Input) => Promise<Output>

export const setupRegisterUserAccount: Setup = (checkDuplicateFieldRepo, userAccountRepo, hasher, token) => async params => {
  const userExists = await checkDuplicateFieldRepo.load({ table: 'user', fieldName: 'email', value: params.email })
  if (!userExists) {
    const hashedPassword = await hasher.hash({ plaintext: params.password })
    const { id } = await userAccountRepo.save({ ...params, password: hashedPassword })
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
}
