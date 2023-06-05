import { z } from 'zod';
import { commentsSchema } from './CommentSchema';
import { createUserSchema } from './UserSchema';

const reactionSchema = z.object({
  kind: z.enum(['like', 'recommendation', 'star']),
  comment: commentsSchema,
  user: createUserSchema,
  active: z.boolean().default(true),
  slug: z.string(),
});

export type Reaction = z.infer<typeof reactionSchema>;
