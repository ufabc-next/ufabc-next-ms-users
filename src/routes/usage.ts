import { getNextUsage } from '@/controller/usage-controller';
import type { FastifyPluginAsync } from 'fastify';

const nextUsageRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    try {
      const usageInfo = await getNextUsage();
      fastify.log.info({ NextUsage: usageInfo });
      return reply.code(200).send(usageInfo);
    } catch (error: unknown) {
      fastify.log.error(error, 'error in NextUsageRoute');
      throw error;
    }
  });
};

export default nextUsageRoute;
