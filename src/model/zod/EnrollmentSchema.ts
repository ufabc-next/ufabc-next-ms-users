import { ObjectId } from 'mongoose';
import { z } from 'zod';

const enrollmentSchema = z.object({
  year: z.number(),
  quad: z.number(),
  identifier: z.string(),
  ra: z.number(),
  disciplina: z.string(),
  subject: z.custom<ObjectId>(),
  campus: z.string(),
  turno: z.union([z.string(), z.string(), z.string()]),
  turma: z.string(),
  teoria: z.custom<ObjectId>(),
  pratica: z.custom<ObjectId>(),
  mainTeacher: z.custom<ObjectId>(),
  comments: z.enum(['teoria', 'pratica']).array(),
  // Vem do portal
  conceito: z.string(),
  creditos: z.number(),
  ca_acumulado: z.number(),
  cr_acumulado: z.number(),
  cp_acumulado: z.number(),
});

export type Enrollment = z.infer<typeof enrollmentSchema>;
