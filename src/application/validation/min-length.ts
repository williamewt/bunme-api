import { InvalidFieldError } from '@/application/errors'

export class MinLengthValidation {
  constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly minLength: number
  ) {}

  validate (): Error | undefined {
    if (this.value.length < this.minLength) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}
