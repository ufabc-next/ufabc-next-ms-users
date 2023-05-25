import { z } from 'zod';

const subjectsSchema = z.object({
  name: z.string(),
  search: z.string(),
  creditos: z.string(),
});

export type Subject = z.infer<typeof subjectsSchema>;
