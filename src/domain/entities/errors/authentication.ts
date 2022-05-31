export class AuthenticationError extends Error {
  constructor () {
    super('Authentication Error')
    this.name = 'AuthenticationError'
  }
}
