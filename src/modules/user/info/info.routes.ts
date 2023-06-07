import type { FastifyInstance } from 'fastify';

// eslint-disable-next-line
export async function infoRoute(app: FastifyInstance) {
  app.get('/users/info', () => '');
}
