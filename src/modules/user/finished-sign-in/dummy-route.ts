import type { FastifyPluginAsync } from 'fastify';
import { pick } from 'lodash';

export const dummyRoute: FastifyPluginAsync = async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    try {
      fastify.log.info('loga pra mim chefe');
      const { user } = request.body;

      if (!user) {
        throw new Error('Nao achei');
      }

      user.set(pick(request.body, ['ra', 'email']));

      await user.save();
      return reply.code(200).send(user);
    } catch (error: unknown) {
      fastify.log.error(error, 'quebrou');
    }
  });
};
