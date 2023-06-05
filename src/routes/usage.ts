import { getNextUsage } from '@/controller/usage-controller';
import type { FastifyPluginAsync } from 'fastify';

const nextUsageRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    try {
      const users = await getNextUsage();
      fastify.log.info('Next Usage', users);
      return reply.code(200).send({ data: users });
    } catch (error: unknown) {
      fastify.log.error(error, 'error in NextUsageRoute');
      throw error;
    }
  });
};

export default nextUsageRoute;
