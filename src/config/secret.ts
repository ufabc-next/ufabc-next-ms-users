import { config as dotEnvConfig } from 'dotenv';
import { z } from 'zod';

if (process.env.NODE_ENV === 'test') {
  dotEnvConfig({ path: '.env.test' });
} else {
  dotEnvConfig();
}

const envSchema = z.object({
  // Local machine
  NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
  PORT: z.coerce.number().default(5000),
  HOST: z.string().min(4).default('localhost'),
  JWT_SECRET: z.string().min(16),
  // MONGODB
  MONGODB_USER: z.string(),
  MONGODB_PORT: z.coerce.number().default(27017),
  MONGODB_PASSWORD: z.string().min(6),
  MONGODB_NAME: z.string(),
  // Redis
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().min(8),
  // Docker URL
  MONGODB_CONNECTION_URL: z.string(),
  REDIS_CONNECTION_URL: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('invalid envs', _env.error.format());
  throw new Error('Invalid environments variables');
}

export const config = _env.data;
