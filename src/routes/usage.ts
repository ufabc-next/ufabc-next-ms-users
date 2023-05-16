import { getNextUsage } from '@/controller/usage-controller';
import type { FastifyPluginAsync } from 'fastify';

const usage: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    try {
      const users = await getNextUsage();
      fastify.log.info('this is working, root route', users);
      return reply.code(200).send({ data: users });
    } catch (error: unknown) {
      fastify.log.error(error, 'error in root route');
      throw error;
    }
  });
};

// eslint-disable-next-line
export default usage;
