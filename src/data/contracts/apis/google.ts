
export interface LoadGoogleUserApi {
  loadUser: (params: LoadGoogleUserApi.Params) => Promise<LoadGoogleUserApi.Result>
}

export namespace LoadGoogleUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined | {
    googleId: string
    name: string
    email: string
  }
}
