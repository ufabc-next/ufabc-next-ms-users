import { ObjectId } from 'mongoose';
import { z } from 'zod';

const groupSchema = z.object({
  disciplina: z.string(),
  season: z.string(),
  mainTeacher: z.custom<ObjectId>(),
  users: z.number().array(),
});

export type Group = z.infer<typeof groupSchema>;
