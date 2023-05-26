import { z } from 'zod';
import { ObjectId } from 'mongoose';

const oAuthSchema = z.object({
  email: z.string(),
  emailFacebook: z.string().email().optional(),
  emailGoogle: z.string().email().optional(),
  facebook: z.string(),
  google: z.string(),
  picture: z.string(),
});

const deviceSchema = z.object({
  _id: z.custom<ObjectId>(),
  deviceId: z.string(),
  token: z.string(),
  phone: z.string(),
});

export const createUserSchema = z.object({
  _id: z.custom<ObjectId>(),
  oauth: oAuthSchema,
  confirmed: z.boolean(),
  email: z.string().email(),
  ra: z.number().int(),
  active: z.boolean(),
  permissions: z.string().array(),
  createdAt: z.string().datetime(),
  devices: deviceSchema.array(),
});

export type User = z.infer<typeof createUserSchema>;
