import { app } from '@/app';
import { config } from '@/config/env';

app.get('/', (request, reply) => {
  // Native json parsing
  return { message: 'Hello World!' };
});

app.listen({ port: config.PORT, host: config.HOST });
