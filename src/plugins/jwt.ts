import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { fastifyJwt, type FastifyJWTOptions } from '@fastify/jwt';
import { config } from '@/config/secret';

export async function jwtAuth(app: FastifyInstance, opts: FastifyJWTOptions) {
  app.register(fastifyJwt, {
    secret: config.JWT_SECRET,
  });

  app.decorate(
    'authenticate',
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        request.log.info({ user: request.user }, 'User authenticated');
        await request.jwtVerify();
        app.log.info('Jwt decorator added');
      } catch (error) {
        reply.log.error({ error }, 'error authenticating user');
        reply.send(error);
      }
    },
  );
}

export default fastifyPlugin(jwtAuth, {
  name: 'JsonWebToken',
});
