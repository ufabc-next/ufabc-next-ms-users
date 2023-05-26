import { ObjectId } from 'mongoose';
import { z } from 'zod';

const reactionSchema = z.object({
  kind: z.enum(['like', 'recommendation', 'star']),
  comment: z.object({
    _id: z.custom<ObjectId>(),
  }),
  user: z.object({
    _id: z.custom<ObjectId>(),
  }),
  active: z.boolean().default(true),
  slug: z.string(),
});

export type Reaction = z.infer<typeof reactionSchema>;
