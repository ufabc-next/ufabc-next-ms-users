import { app } from '@/app';
import { config } from '@/config/env';

const start = async () => {
  try {
    await app.listen({ port: config.PORT, host: config.HOST });
  } catch (error) {
    app.log.fatal(error, 'Error Starting server');
    throw error;
  }
};

start();
