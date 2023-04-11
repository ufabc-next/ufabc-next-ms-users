import fastify from 'fastify';
import { prettyLog } from './config/logger';
import { createUser } from './controller/user';

export const app = fastify({
  // Native fastify logger, it's fast! https://github.com/pinojs/pino
  logger: prettyLog,
});

app.register(createUser, {
  prefix: '/user',
});
