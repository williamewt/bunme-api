
import { MicrosoftApi } from '@/infra/apis'
import { makeAxiosHttpClient } from '@/main/factories/http'

export const makeMicrosoftApi = (): MicrosoftApi => {
  return new MicrosoftApi(
    makeAxiosHttpClient()
  )
}
