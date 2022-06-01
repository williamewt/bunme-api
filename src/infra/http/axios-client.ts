import { HttpGetClient, HttpPostClient } from '@/infra/http'
import axios from 'axios'

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: HttpGetClient.Input): Promise<any> {
    const result = await axios.get(url, { params })
    return result.data
  }

  async post ({ url, params }: HttpPostClient.Input): Promise<any> {
    const result = await axios.post(url, params)
    return result.data
  }
}
