type FacebookData = {
  name: string
  email: string
  facebookId: string
}

type AccountData = {
  id?: string
  name?: string
  createdAt?: Date
  updatedAt?: Date
}
export class FacebookAccount {
  id?: string
  name: string
  email: string
  facebookId: string
  createdAt?: Date
  updatedAt?: Date

  constructor (fbData: FacebookData, accountData?: AccountData) {
    this.id = accountData?.id
    this.name = accountData?.name ?? fbData.name
    this.email = fbData.email
    this.facebookId = fbData.facebookId
    this.createdAt = accountData?.createdAt
    this.updatedAt = accountData?.updatedAt
  }
}
