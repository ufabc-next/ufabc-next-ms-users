import type { FastifyPluginAsync } from 'fastify';
import { STATES, connection } from 'mongoose';

const healthCheckRoute: FastifyPluginAsync = async (app, opts) => {
  app.get('/', async (request, reply) => {
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
};

// eslint-disable-next-line
export default healthCheckRoute;
