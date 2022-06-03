import 'dotenv/config'
import request from 'supertest'

import { app } from '@/main/config/app'
import { UnauthorizedError } from '@/application/errors'

describe('Login Routes', () => {
  describe('Post /login/facebook', () => {
    const loadUserSpy = jest.fn()
    const saveWithFacebookSpy = jest.fn()

    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserSpy })
    }))

    jest.mock('@/infra/postgres/repos/user-account', () => ({
      PgUserAccountRepository: jest.fn().mockReturnValue({
        load: jest.fn().mockResolvedValue(undefined),
        saveWithGoogle: jest.fn().mockResolvedValue(undefined),
        saveWithFacebook: saveWithFacebookSpy
      })
    }))

    it('should return 200 with AccessToken', async () => {
      loadUserSpy.mockResolvedValueOnce({
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
})
