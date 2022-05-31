
export interface LoadFacebookUserApi {
  loadUser: (params: LoadFacebookUserApi.Input) => Promise<LoadFacebookUserApi.Output>
}

export namespace LoadFacebookUserApi {
  export type Input = {
    token: string
  }

  export type Output = undefined | {
    facebookId: string
    name: string
    email: string
  }
}
