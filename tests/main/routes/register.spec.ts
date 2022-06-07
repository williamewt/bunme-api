import request from 'supertest'

import { app } from '@/main/config/app'
import { DuplicateFieldError, FieldsNotMatchError, RequiredFieldError } from '@/application/errors'

describe('Post /register', () => {
  const loadCheckFieldSpy = jest.fn()
  const saveSpy = jest.fn()
  jest.mock('@/infra/postgres/repos/check-duplicate-fields', () => ({
    PgCheckDuplicateFieldsRepository: jest.fn().mockReturnValue({
      load: loadCheckFieldSpy
    })
  }))

  jest.mock('@/infra/postgres/repos/user-account', () => ({
    PgUserAccountRepository: jest.fn().mockReturnValue({
      save: saveSpy
    })
  }))

  it('should return 400 with RequiredFieldError if name is empty', async () => {
    const { status, body } = await request(app)
      .post('/api/register')
      .send({ name: '', email: 'any_email@email.com', password: 'any_password', passwordConfirmation: 'any_password' })

    expect(status).toBe(400)
    expect(body.error).toBe(new RequiredFieldError('name').message)
  })

  it('should return 400 with RequiredFieldError if email is empty', async () => {
    const { status, body } = await request(app)
      .post('/api/register')
      .send({ name: 'any_name', email: '', password: 'any_password', passwordConfirmation: 'any_password' })

    expect(status).toBe(400)
    expect(body.error).toBe(new RequiredFieldError('email').message)
  })

  it('should return 400 with RequiredFieldError if password is empty', async () => {
    const { status, body } = await request(app)
      .post('/api/register')
      .send({ name: 'any_name', email: 'any_email@email.com', password: '', passwordConfirmation: 'any_password' })

    expect(status).toBe(400)
    expect(body.error).toBe(new RequiredFieldError('password').message)
  })

  it('should return 400 with FieldsNotMatchError if passwordConfirmation is different of password', async () => {
    const { status, body } = await request(app)
      .post('/api/register')
      .send({ name: 'any_name', email: 'any_email@email.com', password: 'any_password', passwordConfirmation: 'any_different_password' })

    expect(status).toBe(400)
    expect(body.error).toBe(new FieldsNotMatchError('password').message)
  })

  it('should return 400 with DuplicateFieldError if email is duplicate', async () => {
    loadCheckFieldSpy.mockResolvedValueOnce(true)

    const { status, body } = await request(app)
      .post('/api/register')
      .send({ name: 'any_name', email: 'any_email@email.com', password: 'any_password', passwordConfirmation: 'any_password' })
    expect(status).toBe(400)
    expect(body.error).toBe(new DuplicateFieldError('email').message)
  })

  it('should return 200 with AccessToken', async () => {
    loadCheckFieldSpy.mockResolvedValueOnce(false)

    saveSpy.mockResolvedValueOnce({ id: '1' })

    const { status, body } = await request(app)
      .post('/api/register')
      .send({ name: 'any_name', email: 'any_email@email.com', password: 'any_password', passwordConfirmation: 'any_password' })

    expect(status).toBe(200)
    expect(body.accessToken).toBeDefined()
  })
})
