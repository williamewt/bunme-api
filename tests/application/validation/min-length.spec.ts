import { InvalidFieldError } from '@/application/errors'
import { MinLengthValidation } from '@/application/validation'

describe('MinLengthValidation', () => {
  it('should return InvalidFieldError if value is invalid', () => {
    const sut = new MinLengthValidation('any_value', 'any_field', 10)

    const error = sut.validate()

    expect(error).toEqual(new InvalidFieldError('any_field'))
  })

  it('should return undefined if value is valid', () => {
    const sut = new MinLengthValidation('any_value', 'any_field', 6)

    const valid = sut.validate()

    expect(valid).toEqual(undefined)
  })
})
