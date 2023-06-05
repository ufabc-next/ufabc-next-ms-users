import { ObjectId } from 'mongoose';
import { z } from 'zod';

export const commentsSchema = z.object({
  _id: z.custom<ObjectId>(),
  comment: z.string().nonempty(),
  viewers: z.number().default(0),
  enrollment: z.object({
    _id: z.custom<ObjectId>(),
  }),
  type: z.enum(['teoria', 'pratica']),
  ra: z.string().nonempty(),
  active: z.boolean(),
  teacher: z.object({
    _id: z.custom<ObjectId>(),
  }),
  subject: z.object({
    _id: z.custom<ObjectId>(),
  }),
  // analyze this later
  reactionsCount: z.record(z.number()),
});

export type Comment = z.infer<typeof commentsSchema>;
