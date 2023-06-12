import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { fastifyCookie as cookie } from '@fastify/cookie';
import {
  fastifySession as session,
  FastifySessionOptions,
} from '@fastify/session';
import grant, { type GrantConfig } from 'grant';

import { config } from '@/config/secret';
import { get } from 'lodash';
import { UserModel } from '@/model/User';
import { models } from 'mongoose';

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
  } satisfies GrantConfig;

  const fastifyGrantPlugin = grant.fastify(grantConfig);

  try {
    // break this in pieces later
    app
      .register(cookie)
      .register(session, sessionConfig)
      .register(fastifyGrantPlugin)
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
) => {
  const {
    inApp = '',
    userId = '',
    env = '',
  } = get(request.session, 'grant.dynamic', {});

  const accessToken = request.query.access_token;
  const url = 'https://www.googleapis.com/plus/v1/people/me';

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const userGoogleAccount = await response.json();
  console.log(userGoogleAccount);

  if (!userGoogleAccount.data.id) {
    throw new Error('Missing id');
  }

  const findConditions = [{ 'oauth.google': userGoogleAccount.id }];

  if (userId) {
    findConditions.push({ _id: userId.split('?')[0] } as any);
  }

  const user = await UserModel.findOne({
    $or: findConditions,
  });

  if (user) {
    if (userId) user.set('active', true);

    user.set('oauth.google', userGoogleAccount.id);

    console.log('quero ver', userGoogleAccount.emails);

    if (userGoogleAccount.emails[0].value) {
      user.set('oauth.emailGoogle', userGoogleAccount.emails[0].value);
    }
  } else {
    console.log('quero ver', userGoogleAccount.emails);

    // eslint-disable-next-line
    new models.users({
      oauth: {
        email: userGoogleAccount.emails[0].value,
        google: userGoogleAccount.id,
      },
    });
  }

  await user?.save();

  const WEB_URL = env === 'dev' ? 'http://localhost:7500' : config.GRANT_SECRET;

  return {
    _redirect:
      inApp.split('?')[0] === 'true'
        ? `ufabcnext://login?token=${await user?.generateJWT()}&`
        : `${WEB_URL}/login?token=${user?.generateJWT()}`,
  };
};

export default fastifyPlugin(oauth2, {
  name: 'oauth',
});
