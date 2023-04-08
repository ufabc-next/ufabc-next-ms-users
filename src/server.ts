import { app } from '@/app';

app.get('/', (request, reply) => {
  // Native json parsing
  return { message: 'Hello World!' };
});

app.listen({ port: 5000, host: '0.0.0.0' });
