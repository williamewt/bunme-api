import { FieldsNotMatchError } from '@/application/errors'
import { EqualsValidation } from '@/application/validation'

describe('EqualsValidation', () => {
  it('should return FieldsNotMatch if value is not equal', () => {
    const sut = new EqualsValidation('any_field_name', 'any_value', 'any_different_value')

    const error = sut.validate()

    expect(error).toEqual(new FieldsNotMatchError('any_field_name'))
  })

  it('should return undefined if value is equal', () => {
    const sut = new EqualsValidation('any_field_name', 'any_value', 'any_value')

    const valid = sut.validate()

    expect(valid).toEqual(undefined)
  })
})
