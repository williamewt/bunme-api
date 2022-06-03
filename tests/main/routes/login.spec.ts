import request from 'supertest'

import { app } from '@/main/config/app'
import { UnauthorizedError } from '@/application/errors'

describe('Login Routes', () => {
  const saveWithFacebookSpy = jest.fn()
  const saveWithGoogleSpy = jest.fn()
  jest.mock('@/infra/postgres/repos/user-account', () => ({
    PgUserAccountRepository: jest.fn().mockReturnValue({
      load: jest.fn().mockResolvedValue(undefined),
      saveWithFacebook: saveWithFacebookSpy,
      saveWithGoogle: saveWithGoogleSpy
    })
  }))

  describe('Post /login/facebook', () => {
    const loadUserFacebookSpy = jest.fn()

    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserFacebookSpy })
    }))

    it('should return 200 with AccessToken', async () => {
      loadUserFacebookSpy.mockResolvedValueOnce({
        facebookId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      })

      saveWithFacebookSpy.mockResolvedValueOnce({ id: '1' })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })

  describe('Post /login/google', () => {
    const loadUserGoogleSpy = jest.fn()

    jest.mock('@/infra/apis/google', () => ({
      GoogleApi: jest.fn().mockReturnValue({ loadUser: loadUserGoogleSpy })
    }))

    it('should return 200 with AccessToken', async () => {
      loadUserGoogleSpy.mockResolvedValueOnce({
        googleId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      })

      saveWithGoogleSpy.mockResolvedValueOnce({ id: '1' })

      const { status, body } = await request(app)
        .post('/api/login/google')
        .send({ code: 'valid_code' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/google')
        .send({ code: 'invalid_code' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
