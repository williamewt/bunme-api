export interface LoadUserAccount {
  load: (params: LoadUserAccount.Input) => Promise<LoadUserAccount.Output>
}

export namespace LoadUserAccount {
  export type Input = {
    email: string
  }

  export type Output = undefined | {
    id: string
    name?: string
  }
}

export interface SaveFacebookAccount {
  saveWithFacebook: (params: SaveFacebookAccount.Input) => Promise<SaveFacebookAccount.Output>
}

export namespace SaveFacebookAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId: string
    cellphone?: string
    password?: string
    googleId?: string
    createdAt?: Date
    updatedAt?: Date
  }

  export type Output = {
    id: string
  }
}
