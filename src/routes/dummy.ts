import { studentModel } from '@/model/Student';
import { FastifyPluginAsync } from 'fastify';

const dummyTest: FastifyPluginAsync = async (app) => {
  app.get('/', async (request, reply) => {
    try {
      const qTemosAqui = await studentModel.find({});
      reply.status(200).send({ data: qTemosAqui });
    } catch (error) {
      request.log.error(error, 'Quebrou');
      throw error;
    }
  });

  app.post('/:id', async (request, reply) => {
    const fieldsToUpdate = {
      aluno_id: 4041,
      cursos: [
        {
          id_curso: 45,
          nome_curso: 'Bacharelado em Ciência',
          cp: 0.558,
          cr: 3.349,
          ind_afinidade: 0.6159700000000001,
          turno: 'Diurno',
        },
      ],
      year: 2022,
      quad: 5,
      season: '2022:3',
    };
    try {
      const qTemosAqui = await studentModel.findOneAndUpdate(
        {
          aluno_id: fieldsToUpdate.aluno_id,
        },
        fieldsToUpdate,
        { new: true },
      );
      reply.status(200).send({ data: qTemosAqui });
    } catch (error) {
      request.log.error(error, 'Quebrou');
      throw error;
    }
  });
};

export default dummyTest;
