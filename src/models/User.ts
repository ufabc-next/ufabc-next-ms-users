import { z } from 'zod';
import { Schema, model } from 'mongoose';

const oauthSchema = z.object({
  facebook: z.string(),
  emailFacebook: z.string().email(),
  google: z.string(),
  emailGoogle: z.string().email(),
  email: z.string().email(),
});

const devicesSchema = z.object({
  phone: z.string(),
  token: z.string(),
  device_id: z.string(),
});

const _userSchema = z.object({
  ra: z.number().int(),
  created_at: z.date(),
  email: z.string().email(),
  confirmed: z.boolean(),
  devices: z.array(devicesSchema),
  oauth: oauthSchema,
});

type IUser = z.infer<typeof _userSchema>;

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
