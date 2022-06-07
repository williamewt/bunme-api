import { InvalidFieldError } from '@/application/errors'
import { EmailValidation } from '@/application/validation'

describe('EmailValidation', () => {
  it('should return InvalidFieldError if value is invalid', () => {
    const sut = new EmailValidation('any_email_invalid')

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('email'))
  })

  it('should return undefined if value is valid', () => {
    const sut = new EmailValidation('any_email_valid@email.com')

    const valid = sut.validate()

    expect(valid).toEqual(undefined)
  })
})
