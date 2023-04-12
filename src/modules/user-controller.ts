import type { FastifyReply, FastifyRequest } from 'fastify';
import { userSchema } from './user-schema';
import { showUserInfo } from './user-service';

export async function userInfoHandler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // safely parsed user
  const userInput = userSchema.parse(request.body);
  try {
    const user = await showUserInfo(userInput);
    return reply.code(201).send(user);
  } catch (error) {
    request.log.error(error, 'error getting user info');
    throw error;
  }
}
