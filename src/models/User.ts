import { Schema, model } from 'mongoose';
import { IUser } from '@/modules/user-schema';

const userSchema = new Schema<IUser>({
  ra: {
    type: 'Number',
    required: true,
    unique: true,
    index: { partialFilterExpression: { ra: { $exists: true } } },
  },
  email: {
    type: 'String',
    validate: {
      validator: (email: string) => email.indexOf('ufabc.edu.br') !== -1,
      message: ({ value }) => `${value} não é um e-mail válido`,
    },
    unique: true,
    index: { partialFilterExpression: { email: { $exists: true } } },
  },
  confirmed: {
    type: 'Boolean',
    default: false,
  },
  devices: [
    {
      phone: 'String',
      token: {
        type: 'String',
        required: true,
      },
      device_id: {
        type: 'String',
        required: true,
      },
    },
  ],
});

export const User = model<IUser>('User', userSchema);
