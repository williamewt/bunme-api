export interface Hasher {
  hash: (params: Hasher.Input) => Promise<string>
}

export namespace Hasher {
  export type Input = {
    plaintext: string
  }
  export type Output = string
}

export interface HashComparer {
  compare: (params: HashComparer.Input) => Promise<boolean>
}

export namespace HashComparer {
  export type Input = {
    plaintext: string
    digest: string
  }
  export type Output = boolean
}
