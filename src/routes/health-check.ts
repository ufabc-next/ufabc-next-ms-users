import type { FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';

const healthCheckRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    try {
      const isConnected = `${mongoose.STATES[mongoose.connection.readyState]}`;
      return reply.code(200).send({
        msg: 'All good',
        dbStatus: isConnected,
      });
    } catch (error: unknown) {
      fastify.log.error(error, 'HealthCheck');
    }
  });
};

// eslint-disable-next-line
export default healthCheckRoute;
