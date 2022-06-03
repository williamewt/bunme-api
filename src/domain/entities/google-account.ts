import { AccountData } from '@/domain/entities'

type GoogleData = {
  name: string
  email: string
  googleId: string
}

export class GoogleAccount {
  id?: string
  name: string
  email: string
  googleId: string
  createdAt?: Date
  updatedAt?: Date

  constructor (gData: GoogleData, accountData?: AccountData) {
    this.id = accountData?.id
    this.name = accountData?.name ?? gData.name
    this.email = gData.email
    this.googleId = gData.googleId
    this.createdAt = accountData?.createdAt
    this.updatedAt = accountData?.updatedAt
  }
}
