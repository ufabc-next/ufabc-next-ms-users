import fastify from 'fastify';
import { connectToMongo } from './database/connection';
import nextUsageRoute from './routes/usage';
import healthCheckRoute from './routes/health-check';
import { loggerSetup } from './config/logger';
import { config } from './config/secret';

export let app = fastify();

export async function buildApp() {
  app = fastify({
    logger: loggerSetup[config.NODE_ENV] ?? true,
  });
  try {
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
