import fastify from 'fastify';
import { connectToMongo } from './database/connection';
import { loggerSetup } from './config/logger';
import nextUsageRoute from './routes/usage';

export async function buildApp() {
  const app = fastify({
    logger: loggerSetup,
  });

  try {
    await connectToMongo();
    app.register(nextUsageRoute, {
      prefix: '/stats/usage',
    });
  } catch (error) {
    app.log.fatal('setup app error', error);
    throw error;
  }

  return app;
}
