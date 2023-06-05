import { z } from 'zod';
import { graduationSchema } from './GraduationSchema';

const graduationHistorySchema = z.object({
  ra: z.number(),
  coefficients: z.object({}),
  disciplinas: z.object({}),
  curso: z.string(),
  grade: z.string(),
  graduation: graduationSchema,
});

export type GraduationHistory = z.infer<typeof graduationHistorySchema>;
