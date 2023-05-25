import { z } from 'zod';

const teacherSchema = z.object({
  name: z.string(),
  alias: z.string().array(),
});

export type Teacher = z.infer<typeof teacherSchema>;
