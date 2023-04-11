import fastify from 'fastify';
import { prettyLog } from './config/logger';
import { userRoutes } from './modules/user-routes';

export const app = fastify({
  // Native fastify logger, it's fast! https://github.com/pinojs/pino
  logger: prettyLog,
});

app.register(userRoutes, {
  prefix: '/users',
});
