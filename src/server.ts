import { FastifyServerOptions } from 'fastify';
import closeWithGrace from 'close-with-grace';
import { buildApp } from './app';
import { config } from './config/secret';
import { loggerSetup } from './config/logger';

const appOpts = {
  logger: loggerSetup[config.NODE_ENV] ?? true,
} satisfies FastifyServerOptions;

async function start() {
  const app = await buildApp(appOpts);
  if (config.NODE_ENV === 'dev') {
    app.log.info(`registered routes ${app.printRoutes()}`);
  }
  await app.listen({ port: config.PORT, host: config.HOST });

  closeWithGrace({ delay: 500 }, async ({ err, signal }) => {
    if (err) {
      app.log.fatal({ err }, 'error in startup');
    }
    app.log.info({ signal }, `Gracefully shutting it down `);
    await app.close();
  });
}

start();
