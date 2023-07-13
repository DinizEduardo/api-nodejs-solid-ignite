import { authenticate } from '@/http/controllers/users/authenticate'
import { profile } from '@/http/controllers/users/profile'
import { register } from '@/http/controllers/users/register'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', register)

  app.post('/sessions', authenticate)

  /*
    Rotas Autenticadas
  */

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
