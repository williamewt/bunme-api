
import { Router } from 'express'
import { makeFacebookLoginController, makeGoogleLoginController } from '@/main/factories/controllers'
import { adaptExpressRoute as adapt } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()))
  router.post('/login/google', adapt(makeGoogleLoginController()))
}
