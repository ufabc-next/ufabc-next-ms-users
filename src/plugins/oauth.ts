import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { fastifyCookie as cookie } from '@fastify/cookie';
import {
  fastifySession as session,
  FastifySessionOptions,
} from '@fastify/session';
import grant from 'grant-fastify';

import { config } from '@/config/secret';

export async function oauth2(app: FastifyInstance, opts: {}) {
  const sessionConfig = {
    secret: config.GRANT_SECRET,
    cookie: {
      secure: 'auto',
    },
  } satisfies FastifySessionOptions;
  const grantConfig = {
    defaults: {
      origin: config.ORIGIN,
    },
    facebook: {
      key: config.OAUTH_FACEBOOK_KEY,
      secret: config.OAUTH_FACEBOOK_SECRET,
      callback: '/oauth/facebook',
      scope: ['public_profile', 'email'],
    },
    google: {
      key: config.OAUTH_GOOGLE_KEY,
      secret: config.OAUTH_GOOGLE_SECRET,
      callback: '/oauth/google',
      scope: ['profile', 'email'],
    },
  };

  try {
    // break this in pieces later
    app
      .register(cookie)
      .register(session, sessionConfig)
      .register(grant(grantConfig))
      .get('/oauth/facebook', facebookOAuthHandler)
      .get('/oauth/google', googleOAuthHandler);
    app.log.trace(`Decorated the instance with oauth plugin`);
  } catch (error) {
    app.log.trace(error, 'Error Connecting to mongodb');
  }
}

const facebookOAuthHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {};

const googleOAuthHandler = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {};

export default fastifyPlugin(oauth2);
