
import { GoogleApi } from '@/infra/apis'
import { env } from '@/main/config/env'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeGoogleApi = (): GoogleApi => {
  return new GoogleApi(
    makeAxiosHttpClient(),
    env.googleApi.clientId,
    env.googleApi.clientSecret,
    env.googleApi.redirectUri
  )
}
