import { buildApp } from '@/app';
import { config } from '@/config/secret';

async function start() {
  const app = await buildApp();
  try {
    app.listen({ port: config.PORT, host: config.HOST });
  } catch (error) {
    app.log.fatal(error, 'error in startup');
    process.exit(1);
  }
}

start();
