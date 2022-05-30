
import { PgUserAccountRepository } from '@/infra/postgres/repos'
import { makePrismaClient } from '@/main/factories/repos/postgres'

export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  return new PgUserAccountRepository(makePrismaClient())
}
