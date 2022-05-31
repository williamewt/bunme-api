
import { AuthenticationMiddleware } from '@/application/middlewares'
import { setupAuhthorize } from '@/domain/use-cases'
import { makeJwtTokenHandler } from '../crypto'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const authorize = setupAuhthorize(makeJwtTokenHandler())
  return new AuthenticationMiddleware(authorize)
}
