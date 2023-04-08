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
  // MONGODB
  MONGODB_PORT: z.coerce.number().default(27017),
  MONGODB_USER: z.string(),
  MONGODB_PASSWORD: z.string().min(6),
  // Database name
  MONGODB_NAME: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('invalid envs', _env.error.format());
  throw new Error('Invalid environments variables');
}

export const config = _env.data;
