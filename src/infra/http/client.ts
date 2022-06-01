export interface HttpGetClient {
  get: <T = any> (params: HttpGetClient.Input) => Promise<T>
}

export namespace HttpGetClient {
  export type Input = {
    url: string
    params: object
  }
}

export interface HttpPostClient {
  post: <T = any> (params: HttpPostClient.Input) => Promise<T>
}

export namespace HttpPostClient {
  export type Input = {
    url: string
    params: object
  }
}
