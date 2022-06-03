
import { AxiosHttpClient } from '@/infra/http'

import axios from 'axios'

jest.mock('axios')

describe('AxiosHttpClient', () => {
  let sut: AxiosHttpClient
  let fakeAxios: jest.Mocked<typeof axios>
  let url: string
  let params: object

  beforeAll(() => {
    fakeAxios = axios as jest.Mocked<typeof axios>
    url = 'any_url'
    params = { any: 'any' }
    fakeAxios.get.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
    fakeAxios.post.mockResolvedValue({
      status: 200,
      data: 'any_data'
    })
  })

  beforeEach(() => {
    sut = new AxiosHttpClient()
  })

  describe('get', () => {
    it('should call get with correct params', async () => {
      await sut.get({ url: url, config: { params } })

      expect(fakeAxios.get).toHaveBeenCalledWith(url, { params })
      expect(fakeAxios.get).toBeCalledTimes(1)
    })

    it('should return data on success', async () => {
      const result = await sut.get({ url: url, config: { params } })

      expect(result).toEqual('any_data')
    })

    it('should return data on success if config is empty', async () => {
      const result = await sut.get({ url: url })

      expect(result).toEqual('any_data')
    })

    it('should rethrow if get throws', async () => {
      fakeAxios.get.mockRejectedValueOnce(new Error('http_error'))

      const promise = sut.get({ url: url, config: { params } })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })

  describe('post', () => {
    it('should call post with correct params', async () => {
      await sut.post({ url: url, params })

      expect(fakeAxios.post).toHaveBeenCalledWith(url, params)
      expect(fakeAxios.post).toBeCalledTimes(1)
    })

    it('should return data on success', async () => {
      const result = await sut.post({ url: url, params })

      expect(result).toEqual('any_data')
    })

    it('should rethrow if post throws', async () => {
      fakeAxios.post.mockRejectedValueOnce(new Error('http_error'))

      const promise = sut.post({ url: url, params })

      await expect(promise).rejects.toThrow(new Error('http_error'))
    })
  })
})
