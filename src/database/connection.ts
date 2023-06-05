import { config } from '@/config/env';
import { connect } from 'mongoose';

// TODO: MIgrate to a plugin so i can log stuff
export async function connectToMongo() {
  try {
    const connection = await connect(config.CONNECTION_URL);
    return connection;
  } catch (error) {
    console.error('Error connecting to mongo:', error);
    throw error;
  }
}
