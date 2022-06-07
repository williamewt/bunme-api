import { CheckDuplicateFields } from '@/domain/contracts/repos'
import { PrismaClient } from '@prisma/client'

type LoadInput = CheckDuplicateFields.Input
type LoadOutput = CheckDuplicateFields.Output

export class PgCheckDuplicateFieldsRepository implements CheckDuplicateFields {
  constructor (private readonly client: PrismaClient) {}

  async load ({ table, fieldName, value, id }: LoadInput): Promise<LoadOutput> {
    let data: object
    if (id !== undefined) {
      data = {
        where: {
          [fieldName]: value,
          id: {
            not: id
          }
        }
      }
    } else {
      data = {
        where: {
          [fieldName]: value
        }
      }
    }
    const pgUser = await (this.client as any)[table].findUnique(data)
    if (pgUser !== null) {
      return true
    }
    return false
  }
}
