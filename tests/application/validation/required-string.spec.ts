import { RequiredFieldError } from '@/application/errors'

class RequiredStringValidation {
  constructor (
    private readonly value: string,
    private readonly fieldName: string
  ) {}

  validate (): Error | undefined {
    return new RequiredFieldError('any_field')
  }
}

describe('RequiredStringValidation', () => {
  it('should return RequiredFieldError if value is empty', () => {
    const sut = new RequiredStringValidation('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is null', () => {
    const sut = new RequiredStringValidation(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is undefined', () => {
    const sut = new RequiredStringValidation(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequiredFieldError('any_field'))
  })
})
