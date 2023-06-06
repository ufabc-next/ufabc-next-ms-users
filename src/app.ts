import fastify from 'fastify';
import { fastifyRedis } from '@fastify/redis';

import { connectToMongo } from './database/connection';
import { loggerSetup } from './config/logger';
import { config } from './config/secret';
import nextUsageRoute from './routes/usage';
import healthCheckRoute from './routes/health-check';

// is a build function necessary? need help to see alternatives
export async function buildApp() {
  const app = fastify({
    logger: loggerSetup[config.NODE_ENV] ?? true,
  });

  try {
    app.register(fastifyRedis, {
      host: config.HOST,
      password: config.REDIS_PASSWORD,
      port: config.REDIS_PORT,
      family: 4, // IPV4,
    });
    await connectToMongo();
    // TODO: Implement @fastify/autoload
    app.register(healthCheckRoute, {
      prefix: '/v2/healthCheck',
    });
    app.register(nextUsageRoute, {
      prefix: '/v2/stats/usage',
    });
  } catch (error) {
    app.log.fatal('setup app error', error);
    throw error;
  }

  return app;
}
