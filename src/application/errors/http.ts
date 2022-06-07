export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server Failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}

export class InvalidFieldError extends Error {
  constructor (fieldName: string) {
    super(`The ${fieldName} is invalid`)
    this.name = 'InvalidFieldError'
  }
}

export class FieldsNotMatchError extends Error {
  constructor (fieldName: string) {
    super(`${fieldName} fields do not match`)
    this.name = 'FieldsNotMatchError'
  }
}

export class DuplicateFieldError extends Error {
  constructor (fieldName: string) {
    super(`The received ${fieldName} is already in use`)
    this.name = 'DuplicateFieldError'
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class InvalidCredentialsError extends Error {
  constructor () {
    super('Invalid credentials')
    this.name = 'InvalidCredentialsError'
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super('Access denied')
    this.name = 'ForbiddenError'
  }
}
