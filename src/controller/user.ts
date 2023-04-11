import { User } from '@/models/User';
import type { FastifyInstance } from 'fastify';

export async function createUser(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    try {
      const user = new User(request.body);
      await user.save();
      reply.status(201).send(user);
    } catch (error) {
      request.log.error(error, 'Something break');
      throw error;
    }
  });
}
