import fastify from 'fastify';

export const app = fastify({
  // Native fastify logger, it's fast! https://github.com/pinojs/pino
  logger: true,
});
