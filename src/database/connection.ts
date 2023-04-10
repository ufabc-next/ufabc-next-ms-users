import { config } from '@/config/env';
import { connect } from 'mongoose';

connect(config.DATABASE_URL)
  .then(() => {
    console.log('Connected to mongodb');
  })
  .catch((error) => console.error('Error in connection', error));
