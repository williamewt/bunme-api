export interface LoadMicrosoftUser {
  loadUser: (params: LoadMicrosoftUser.Input) => Promise<LoadMicrosoftUser.Output>
}

export namespace LoadMicrosoftUser {
  export type Input = {
    token: string
  }

  export type Output = undefined | {
    microsoftId: string
    name: string
    email: string
  }
}
