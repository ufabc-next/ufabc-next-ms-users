import fastify from 'fastify';
import { connectToMongo } from './database/connection';

export async function buildApp() {
  const app = fastify({
    logger: true,
  });

  try {
    await connectToMongo();
  } catch (error) {
    app.log.fatal("setup app error", error)
    throw error
  }

  return app;
}
