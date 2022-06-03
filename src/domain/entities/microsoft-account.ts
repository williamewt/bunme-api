import { AccountData } from '@/domain/entities'

type MicrosoftData = {
  name: string
  email: string
  microsoftId: string
}

export class MicrosoftAccount {
  id?: string
  name: string
  email: string
  microsoftId: string
  createdAt?: Date
  updatedAt?: Date

  constructor (gData: MicrosoftData, accountData?: AccountData) {
    this.id = accountData?.id
    this.name = accountData?.name ?? gData.name
    this.email = gData.email
    this.microsoftId = gData.microsoftId
    this.createdAt = accountData?.createdAt
    this.updatedAt = accountData?.updatedAt
  }
}
