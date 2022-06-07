
import { Router } from 'express'
import { makeRegisterController } from '@/main/factories/controllers'
import { adaptExpressRoute as adapt } from '@/main/adapters'

export default (router: Router): void => {
  router.post('/register', adapt(makeRegisterController()))
}
