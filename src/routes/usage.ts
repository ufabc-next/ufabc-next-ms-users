import type { FastifyPluginAsync } from 'fastify';

const usage: FastifyPluginAsync = async (fastify, opts) => {
   fastify.get('/', async (request, reply) => {
    try {
      fastify.log.info('this is working, root route')
      return reply.code(200).send({ msg: 'be welcome guest' })
    } catch (error: unknown) {
      fastify.log.error(error, 'error in root route')
    }
  })

};

export default usage;
