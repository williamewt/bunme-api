export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
}

export interface CreateGoogleAccountRepository {
  createFromGoogle: (params: CreateGoogleAccountRepository.Params) => Promise<void>
}

export namespace CreateGoogleAccountRepository {
  export type Params = {
    name: string
    email: string
    googleId: string
  }
}
