import fastify from 'fastify';
import { prettyLog } from './config/logger';

export const app = fastify({
  // Native fastify logger, it's fast! https://github.com/pinojs/pino
  logger: prettyLog,
});
