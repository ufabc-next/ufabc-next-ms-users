import { fastify, type FastifyServerOptions } from 'fastify';
import { fastifyAutoload } from '@fastify/autoload';
import { fastifyRedis } from '@fastify/redis';

import { join } from 'node:path';

import { config } from './config/secret';
import { nextUsageRoute } from './modules/nextUsage';
import { healthCheckRoute } from './modules/healthCheck';

export async function buildApp(opts: FastifyServerOptions = {}) {
  const app = fastify(opts);
  try {
    app.register(fastifyAutoload, {
      dir: join(__dirname, 'plugins'),
    });
    app.register(fastifyRedis, {
      host: config.HOST,
      password: config.REDIS_PASSWORD,
      port: config.REDIS_PORT,
      family: 4, // IPV4,
    });
    app.register(healthCheckRoute, { prefix: '/v2' });
    app.register(nextUsageRoute, { prefix: '/v2' });
  } catch (error) {
    app.log.fatal('setup app error', error);
    throw error;
  }

  return app;
}
