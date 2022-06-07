import request from 'supertest'

import { app } from '@/main/config/app'
import { InvalidCredentialsError, UnauthorizedError } from '@/application/errors'

describe('Login Routes', () => {
  const saveWithFacebookSpy = jest.fn()
  const saveWithGoogleSpy = jest.fn()
  const saveWithMicrosoftSpy = jest.fn()
  const loadByEmailSpy = jest.fn()

  jest.mock('@/infra/postgres/repos/user-account', () => ({
    PgUserAccountRepository: jest.fn().mockReturnValue({
      loadByEmail: loadByEmailSpy,
      saveWithFacebook: saveWithFacebookSpy,
      saveWithGoogle: saveWithGoogleSpy,
      saveWithMicrosoft: saveWithMicrosoftSpy
    })
  }))

  describe('Post /login', () => {
    const compareSpy = jest.fn()

    jest.mock('@/infra/crypto/bcrypt-handler', () => ({
      BcryptHandler: jest.fn().mockReturnValue({ compare: compareSpy })
    }))

    beforeAll(() => {
      loadByEmailSpy.mockResolvedValue({
        id: 'any_id',
        name: 'any_name',
        password: 'any_password'
      })
    })

    it('should return 200 with AccessToken', async () => {
      compareSpy.mockResolvedValueOnce(true)

      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email: 'any_email@email.com', password: 'any_password' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 400 with InvalidCredentialsError when pass invalid email', async () => {
      loadByEmailSpy.mockResolvedValueOnce(undefined)

      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email: 'any_invalid_email@email.com', password: 'any_password' })

      expect(status).toBe(400)
      expect(body.error).toBe(new InvalidCredentialsError().message)
    })

    it('should return 400 with InvalidCredentialsError when pass invalid password', async () => {
      compareSpy.mockResolvedValueOnce(false)

      const { status, body } = await request(app)
        .post('/api/login')
        .send({ email: 'any_email@email.com', password: 'any_invalid_password' })

      expect(status).toBe(400)
      expect(body.error).toBe(new InvalidCredentialsError().message)
    })
  })

  describe('Post /login/facebook', () => {
    const loadUserFacebookSpy = jest.fn()

    jest.mock('@/infra/apis/facebook', () => ({
      FacebookApi: jest.fn().mockReturnValue({ loadUser: loadUserFacebookSpy })
    }))

    beforeAll(() => {
      loadByEmailSpy.mockResolvedValue(undefined)
    })

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

    beforeAll(() => {
      loadByEmailSpy.mockResolvedValue(undefined)
    })

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

  describe('Post /login/microsoft', () => {
    const loadUserMicrosoftSpy = jest.fn()

    jest.mock('@/infra/apis/microsoft', () => ({
      MicrosoftApi: jest.fn().mockReturnValue({ loadUser: loadUserMicrosoftSpy })
    }))

    it('should return 200 with AccessToken', async () => {
      loadUserMicrosoftSpy.mockResolvedValueOnce({
        microsoftId: 'any_id',
        name: 'any_name',
        email: 'any_email'
      })

      saveWithMicrosoftSpy.mockResolvedValueOnce({ id: '1' })

      const { status, body } = await request(app)
        .post('/api/login/microsoft')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/microsoft')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
