import { z } from 'zod';
import { subjectsSchema } from './SubjectSchema';
import { teacherSchema } from './TeacherSchema';

const disciplinaSchema = z.object({
  disciplina_id: z.number(),
  disciplina: z.string(),
  turno: z.string().nonempty(),
  turma: z.string(),
  vagas: z.number(),
  obrigatorias: z.number().array(),
  codigo: z.string(),
  campus: z.string(),
  // what is this
  ideal_quad: z.boolean(),

  subject: subjectsSchema,
  identifier: z.string(),

  // lista de alunos matriculados no momento
  alunos_matriculados: z.number().array().default([]),

  before_kick: z.number().array().default([]),
  after_kick: z.number().array().default([]),

  year: z.number(),
  quad: z.number(),

  teoria: teacherSchema,
  pratica: teacherSchema,
});

export type Disciplina = z.infer<typeof disciplinaSchema>;
