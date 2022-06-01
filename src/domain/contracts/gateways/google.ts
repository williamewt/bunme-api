export interface LoadGoogleUser {
  loadUser: (params: LoadGoogleUser.Input) => Promise<LoadGoogleUser.Output>
}

export namespace LoadGoogleUser {
  export type Input = {
    code: string
  }

  export type Output = undefined | {
    googleId: string
    name: string
    email: string
  }
}
