import { z } from 'zod';

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

export const userSchema = z.object({
  ra: z.number().int(),
  created_at: z.date(),
  email: z.string().email(),
  confirmed: z.boolean(),
  devices: z.array(devicesSchema),
  oauth: oauthSchema,
});

export type IUser = z.infer<typeof userSchema>;
