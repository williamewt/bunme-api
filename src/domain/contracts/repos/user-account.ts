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
  save: SetupSave
  saveWithFacebook: SetupSave
  saveWithGoogle: SetupSave
  saveWithMicrosoft: SetupSave
}

export namespace SaveUserAccount {
  export type Input = {
    id?: string
    name: string
    email: string
    password?: string
    facebookId?: string
    googleId?: string
    microsoftId?: string
    createdAt?: Date
    updatedAt?: Date
  }

  export type Output = {
    id: string
  }
}
