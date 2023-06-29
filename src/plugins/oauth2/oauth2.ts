import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import { FastifyOAuth2Options, fastifyOauth2 } from '@fastify/oauth2';
import { FastifySessionOptions } from '@fastify/session';
import { config } from '@/config/secret';
import { getOauthInfo } from '@/helpers/sfetch/get-oauth-info';

const sessionConfig = {
  secret: config.GRANT_SECRET,
  cookie: {
    secure: 'auto',
    maxAge: 604800000, // TTL (one week)
  },
} satisfies FastifySessionOptions;

const oauth2config = {
  name: 'GoogleOauth2Provider',
  scope: ['profile', 'email'],
  credentials: {
    client: {
      id: config.OAUTH_GOOGLE_CLIENT_ID,
      secret: config.OAUTH_GOOGLE_SECRET,
    },
    auth: fastifyOauth2.GOOGLE_CONFIGURATION,
  },
  startRedirectPath: '/login/google',
  callbackUri: 'http://localhost:5000/oauth/google',
} satisfies FastifyOAuth2Options;

export async function oauth2(app: FastifyInstance, opts: {}) {
  app.register(fastifyOauth2, oauth2config);

  app.get('/oauth/google', async function (request, reply) {
    try {
      const { token } =
        await this.GoogleOauth2Provider.getAccessTokenFromAuthorizationCodeFlow(
          request,
        );

      request.log.info({ token }, 'token');
      const data = await getOauthInfo(
        'https://www.googleapis.com/plus/v1/people/me',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );

      console.log('data', data);
      reply
        .status(200)
        .redirect('http://localhost:5500/?token="' + token.access_token);
    } catch (error) {
      reply.log.fatal({ error }, 'Error in oauth2');
      return reply.send(error);
    }
  });
}

export default fastifyPlugin(oauth2);
