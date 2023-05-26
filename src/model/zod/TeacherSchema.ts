import { ObjectId } from 'mongoose';
import { z } from 'zod';

export const teacherSchema = z.object({
  _id: z.custom<ObjectId>(),
  name: z.string(),
  alias: z.string().array(),
});

export type Teacher = z.infer<typeof teacherSchema>;
