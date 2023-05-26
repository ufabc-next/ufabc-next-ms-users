import { CommentModel } from '@/model/Comment';
import { FastifyPluginAsync } from 'fastify';

const dummyTest: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    try {
      const qTemosAqui = await CommentModel.find({});
      reply.status(200).send({ data: qTemosAqui });
    } catch (error) {
      request.log.error(error, 'Quebrou');
      throw error;
    }
  });

  app.post('/', async (request, reply) => {
    try {
      const comment = new CommentModel();
      const qTemosAqui = comment.save();
      reply.status(200).send({ data: qTemosAqui });
    } catch (error) {
      request.log.error(error, 'Quebrou');
      throw error;
    }
  });
};

export default dummyTest;
