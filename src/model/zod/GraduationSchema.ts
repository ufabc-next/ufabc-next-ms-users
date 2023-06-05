import { ObjectId } from 'mongoose';
import { z } from 'zod';

export const graduationSchema = z.object({
  _id: z.custom<ObjectId>(),
  locked: z.boolean().default(false),
  curso: z.string(),
  grade: z.string(),

  mandatory_credits_number: z.number(),
  limited_credits_number: z.number(),
  free_credits_number: z.number(),
  credits_total: z.number(),

  creditsBreakdown: z
    .object({
      year: z.number(),
      quad: z.number(),
      choosableCredits: z.number(),
    })
    .array(),
});

export type Graduation = z.infer<typeof graduationSchema>;
