import type { FastifyInstance } from 'fastify';
import { getNextUsage } from './next-usage.controller';

export async function nextUsageRoute(app: FastifyInstance) {
  app.get('/stats/usage', getNextUsage);
}
