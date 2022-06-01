
import { Router } from 'express'
import { makeFacebookLoginController } from '@/main/factories/controllers'
import { adaptExpressRoute as adapt } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/login/facebook', adapt(makeFacebookLoginController()))
  router.get('/test', (req, res) => {
    const a = 'test3'
    res.json({ a })
  })
}
