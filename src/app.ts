import fastify from 'fastify';
import { ZodError } from 'zod';
import { prettyLog } from './config/logger';
import { userRoutes } from './modules/user-routes';
import { config } from './config/env';

export const app = fastify({
  // Native fastify logger, it's fast! https://github.com/pinojs/pino
  logger: prettyLog,
});

app.register(userRoutes, {
  prefix: '/users',
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Validation error',
      issues: error.format(),
    });
  }
  if (config.NODE_ENV !== 'prod') {
    reply.log.error(error, 'Unknown error');
  } else {
    // TODO: Move log to external tool, cause production bugs are complicated
  }

  return reply.status(500).send({ message: 'Internal server error' });
});
