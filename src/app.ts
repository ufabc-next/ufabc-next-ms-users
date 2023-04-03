import { createServer } from 'node:http';

createServer((req, res) => {
  res.end('say hi');
});
