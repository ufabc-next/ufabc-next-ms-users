import type { FastifyInstance } from 'fastify';
import { userInfoHandler } from './user-controller';

export async function userRoutes(app: FastifyInstance) {
  app.post('/info', userInfoHandler);
}
