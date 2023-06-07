import fastify from 'fastify';
import { fastifyAutoload } from '@fastify/autoload';
import { fastifyRedis } from '@fastify/redis';
import { fastifyJwt } from '@fastify/jwt';

import { join } from 'node:path';
import { loggerSetup } from './config/logger';
import { config } from './config/secret';
import { nextUsageRoute } from './modules/nextUsage';
import { healthCheckRoute } from './modules/healthCheck';
export let app = fastify();

export async function buildApp() {
  app = fastify({
    logger: loggerSetup[config.NODE_ENV] ?? true,
  });
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
    app.register(fastifyJwt, {
      secret: config.JWT_SECRET,
    });
    // TODO: Implement @fastify/autoload
    app.register(healthCheckRoute, { prefix: '/v2' });
    app.register(nextUsageRoute, { prefix: '/v2' });
  } catch (error) {
    app.log.fatal('setup app error', error);
    throw error;
  }

  return app;
}
