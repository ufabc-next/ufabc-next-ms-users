import { ReactionModel } from '@/model/Reaction';
import { FastifyPluginAsync } from 'fastify';

const dummyTest: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    try {
      const qTemosAqui = await ReactionModel.find({});
      reply.status(200).send({ data: qTemosAqui });
    } catch (error) {
      request.log.error(error, 'Quebrou');
      throw error;
    }
  });

  app.post('/', async (request, reply) => {
    try {
      const comment = new ReactionModel();
      const qTemosAqui = comment.save();
      reply.status(200).send({ data: qTemosAqui });
    } catch (error) {
      request.log.error(error, 'Quebrou');
      throw error;
    }
  });
};

export default dummyTest;
