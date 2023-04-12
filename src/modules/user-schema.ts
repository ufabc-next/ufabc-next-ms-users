import { z } from 'zod';

const oauthSchema = z.object({
  facebook: z.string().optional(),
  emailFacebook: z.string().email().optional(),
  google: z.string().optional(),
  emailGoogle: z.string().email().optional(),
  email: z.string().email().optional(),
});

const devicesSchema = z.object({
  phone: z.string(),
  token: z.string(),
  device_id: z.string(),
});

export const userSchema = z.object({
  ra: z.number().int(),
  created_at: z.string().datetime(),
  email: z.string().email(),
  confirmed: z.boolean(),
  devices: z.array(devicesSchema),
  oauth: oauthSchema,
});

export type IUser = z.infer<typeof userSchema>;
