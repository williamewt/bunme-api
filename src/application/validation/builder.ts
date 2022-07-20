import { EmailValidation, EqualsValidation, RequiredStringValidation, Validator } from '@/application/validation'
import { MinLengthValidation } from './min-length'

export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of (params: {value: string, fieldName: string}): ValidationBuilder {
    return new ValidationBuilder(params.value, params.fieldName)
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidation(this.value, this.fieldName))
    return this
  }

  min (minLength: number): ValidationBuilder {
    this.validators.push(new MinLengthValidation(this.value, this.fieldName, minLength))
    return this
  }

  email (): ValidationBuilder {
    this.validators.push(new EmailValidation(this.value))
    return this
  }

  equals (valueToCompare: any): ValidationBuilder {
    this.validators.push(new EqualsValidation(this.fieldName, this.value, valueToCompare))
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
