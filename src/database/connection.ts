import { config } from '@/config/env';
import { connect } from 'mongoose';

connect(config.DATABASE_URL, {
  dbName: config.DB_NAME,
})
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((error) => console.error('Error in connection', error));
