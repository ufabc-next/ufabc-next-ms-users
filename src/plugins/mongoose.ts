import type { FastifyInstance } from 'fastify';
import { fastifyPlugin } from 'fastify-plugin';
import { Connection, connect } from 'mongoose';
import { config } from '@/config/secret';

interface FastifyMongooseOptions {
  readonly connection: Connection;
}

export async function mongoose(
  app: FastifyInstance,
  opts: FastifyMongooseOptions,
) {
  try {
    const connection = await connect(config.MONGODB_CONNECTION_URL);
    app.decorate('mongoose', connection);
    app.log.info(`Decorated the instance with mongoose`);
  } catch (error) {
    app.log.error(error, 'Error Connecting to mongodb');
    // Do not let the database connection hanging
    app.addHook('onClose', async () => {
      await opts.connection.close();
    });
  }
}

export default fastifyPlugin(mongoose, {
  name: 'Mongoose',
});
