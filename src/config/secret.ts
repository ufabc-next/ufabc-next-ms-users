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
  PORT: z.coerce.number().default(3000),
  HOST: z.string().min(4).default('localhost'),
  ORIGIN: z.string().url().default('http://localhost:5000'),
  JWT_SECRET: z.string().min(16),
  GRANT_SECRET: z.string().min(32),

  // OAUTH2
  OAUTH_FACEBOOK_KEY: z.string(),
  OAUTH_FACEBOOK_SECRET: z.string().min(16),
  OAUTH_GOOGLE_KEY: z.string(),
  OAUTH_GOOGLE_SECRET: z.string().min(16),

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
  const { fieldErrors } = _env.error.flatten();
  const errorMessage = Object.entries(fieldErrors)
    .map(([field, errors]) =>
      errors ? `${field}: ${errors.join(', ')}` : field,
    )
    .join('\n  ');
  throw new Error(`Missing environment variables:\n  ${errorMessage}`);
}

export const config = _env.data;
