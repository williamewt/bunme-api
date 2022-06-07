
import { PgCheckDuplicateFieldsRepository } from '@/infra/postgres/repos'
import { makePrismaClient } from '@/main/factories/repos/postgres'

export const makePgCheckDuplicateFieldsRepository = (): PgCheckDuplicateFieldsRepository => {
  return new PgCheckDuplicateFieldsRepository(makePrismaClient())
}
