import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { fastifyCookie as cookie } from '@fastify/cookie';
import {
  fastifySession as session,
  type FastifySessionOptions,
} from '@fastify/session';
import grant, { type GrantConfig } from 'grant';
import { config } from '@/config/secret';

export async function oauth(app: FastifyInstance, opts: {}) {
  const sessionConfig = {
    secret: config.GRANT_SECRET,
    saveUninitialized: true,
  } satisfies FastifySessionOptions;
  const grantConfig = {
    defaults: { origin: config.ORIGIN },
    google: {
      key: config.OAUTH_GOOGLE_KEY,
      secret: config.OAUTH_GOOGLE_SECRET,
      callback: '/oauth/google',
      scope: ['profile', 'email'],
    },
  } satisfies GrantConfig;
  const fastifyGrantPlugin = grant.fastify(grantConfig);

  app
    .register(cookie)
    .register(session, sessionConfig)
    .register(fastifyGrantPlugin);
}

export default fastifyPlugin(oauth, {
  name: 'OAuth2',
});
