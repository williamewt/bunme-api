import { Middleware } from '@/application/middlewares'
import { RequestHandler } from 'express'

type Adpter = (middleware: Middleware) => RequestHandler

export const adaptExpressMiddleware: Adpter = middleware => async (req, res, next) => {
  const { statusCode, data } = await middleware.handle({ ...req.headers })
  if (statusCode === 200) {
    const entries = Object.entries(data).filter(entry => entry[1])
    req.locals = { ...req.locals, ...Object.fromEntries(entries) }
    next()
  } else {
    res.status(statusCode).json({ error: data.message })
  }
}
