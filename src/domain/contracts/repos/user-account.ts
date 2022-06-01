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

type SetupSave = (params: SaveUserAccount.Input) => Promise<SaveUserAccount.Output>
export interface SaveUserAccount {
  saveWithFacebook: SetupSave
  saveWithGoogle: SetupSave
}

export namespace SaveUserAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    facebookId?: string
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
