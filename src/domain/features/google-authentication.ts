import { AccessToken } from '@/domain/models'
import { AuthenticationError } from '@/domain/errors'

export interface GoogleAuthentication {
  perform: (params: GoogleAuthentication.Params) => Promise<GoogleAuthentication.Result>
}

export namespace GoogleAuthentication {

  export type Params = {
    token: string
  }

  export type Result = AccessToken | AuthenticationError
}
