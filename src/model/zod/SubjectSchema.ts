import { ObjectId } from 'mongoose';
import { z } from 'zod';

export const subjectsSchema = z.object({
  _id: z.custom<ObjectId>(),
  name: z.string(),
  search: z.string(),
  creditos: z.string(),
});

export type Subject = z.infer<typeof subjectsSchema>;
