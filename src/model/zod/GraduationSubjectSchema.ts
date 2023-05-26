import { z } from 'zod';
import { subjectsSchema } from './SubjectSchema';
import { graduationSchema } from './GraduationSchema';

const graduationSubjectSchema = z.object({
  category: z.enum(['mandatory', 'limited', 'free']),
  confidence: z.string(),
  subCategory: z.enum([
    'firstLevelMandatory',
    'secondLevelMandatory',
    'thirdLevelMandatory',
  ]),

  creditos: z.number(),
  codigo: z.string(),

  year: z.number(),
  quad: z.number(),

  equivalents: z.string().array(),
  subject: subjectsSchema,
  graduation: graduationSchema,
});

export type GraduationSubject = z.infer<typeof graduationSubjectSchema>;
