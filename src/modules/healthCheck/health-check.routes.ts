import type { FastifyInstance } from 'fastify';
import { STATES, connection } from 'mongoose';

export async function healthCheckRoute(app: FastifyInstance) {
  app.get('/healthCheck', async (request, reply) => {
    try {
      const isConnected = `${STATES[connection.readyState]}`;
      const isConnectedToRedis =
        (await app.redis.ping()) === 'PONG' ? 'Connected' : null;
      return reply.code(200).send({
        msg: 'All good',
        mongoStatus: isConnected,
        redisStatus: isConnectedToRedis,
      });
    } catch (error: unknown) {
      app.log.error(error, 'HealthCheck');
    }
  });
}
