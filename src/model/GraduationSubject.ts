import type { GraduationSubject } from './zod/GraduationSubjectSchema';
import { Schema, Types, model } from 'mongoose';

const graduationSubjectSchema = new Schema<GraduationSubject>({
  subject: {
    type: Types.ObjectId,
    ref: 'subjects',
  },
  graduation: {
    type: Types.ObjectId,
    ref: 'graduation',
  },
});

graduationSubjectSchema.index({ graduation: 1 });

export const GraduationSubjectModel = model(
  'SubjectGraduations',
  graduationSubjectSchema,
);
