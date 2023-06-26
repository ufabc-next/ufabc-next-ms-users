import type { FastifyInstance } from 'fastify';
import { signUpUser } from './integration/cognito';

export async function oauthRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const { username, email, password } = request.body;
      const signUpResponse = await signUpUser(username, email, password);
      reply.send({
        message: 'Usuário registrado com sucesso',
        data: signUpResponse,
      });
    } catch (error) {
      reply
        .code(500)
        .send({ error: 'Erro ao registrar usuário', message: error.message });
    }
  });
}
