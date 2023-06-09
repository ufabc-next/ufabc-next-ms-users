import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { fastifyRedis, type FastifyRedisPluginOptions } from '@fastify/redis';
import { config } from '@/config/secret';

export async function redis(
  app: FastifyInstance,
  opts: FastifyRedisPluginOptions,
) {
  try {
    app.register(fastifyRedis, {
      host: config.HOST,
      password: config.REDIS_PASSWORD,
      port: config.REDIS_PORT,
      family: 4, // IPV4,
    });
    app.log.info(`Decorated the instance with redis`);
  } catch (error) {
    app.log.error(error, 'Error Connecting to mongodb');
  }
}

export default fastifyPlugin(redis);
