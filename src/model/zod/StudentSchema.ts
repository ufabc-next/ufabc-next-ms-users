import { z } from 'zod';

// Portugues schema, to respect current db conventions
export const courseSchema = z.object({
  id_curso: z.number().int(),
  nome_curso: z.string(),
  cp: z.number(),
  cr: z.number(),
  ind_afinidade: z.number(),
  turno: z.union([z.string(), z.string(), z.string()]),
});

export const StudentSchema = z.object({
  ra: z.number().int(),
  login: z.string(),
  aluno_id: z.number().int(),
  cursos: courseSchema.array(),
  year: z.number(),
  quad: z.number(),
  quads: z.number(),
});

export type Student = z.infer<typeof StudentSchema>;
