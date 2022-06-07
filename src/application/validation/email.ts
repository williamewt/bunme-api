import { InvalidFieldError } from '@/application/errors'

import validator from 'validator'

export class EmailValidation {
  constructor (
    private readonly value: string
  ) {}

  validate (): Error | undefined {
    const isValid = validator.isEmail(this.value)
    if (!isValid) {
      return new InvalidFieldError('email')
    }
  }
}
