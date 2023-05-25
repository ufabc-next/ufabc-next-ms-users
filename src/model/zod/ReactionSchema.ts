import { ObjectId } from 'mongoose';
import { z } from 'zod';

const reactionSchema = z.object({
  kind: z.enum(['like', 'recommendation', 'star']),
  comment: z.custom<ObjectId>(),
  user: z.custom<ObjectId>(),
  active: z.boolean().default(true),
  slug: z.string(),
});

export type Reaction = z.infer<typeof reactionSchema>;
