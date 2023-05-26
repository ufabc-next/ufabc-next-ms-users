import { z } from 'zod';

const historySchema = z.object({
  ra: z.number(),
  // Gotta see the props
  disciplinas: z.object({}),
  coefficients: z.object({}),

  curso: z.string(),
  grade: z.string(),
});

export type History = z.infer<typeof historySchema>;
