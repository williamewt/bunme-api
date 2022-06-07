import { FieldsNotMatchError } from '@/application/errors'

export class EqualsValidation {
  constructor (
    private readonly fieldName: string,
    private readonly value: any,
    private readonly valueToCompare: any
  ) {}

  validate (): Error | undefined {
    if (this.value !== this.valueToCompare) {
      return new FieldsNotMatchError(this.fieldName)
    }
  }
}
