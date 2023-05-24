import fastify from 'fastify';
import { connectToMongo } from './database/connection';
import { loggerSetup } from './config/logger';
import nextUsageRoute from './routes/usage';
import healthCheckRoute from './routes/health-check';
import dummyTest from './routes/dummy';

export async function buildApp() {
  const app = fastify({
    logger: loggerSetup,
  });

  try {
    await connectToMongo();
    app.register(healthCheckRoute, {
      prefix: '/healthCheck',
    });
    app.register(nextUsageRoute, {
      prefix: '/stats/usage',
    });
    app.register(dummyTest, {
      prefix: '/dummy',
    });
  } catch (error) {
    app.log.fatal('setup app error', error);
    throw error;
  }

  return app;
}
