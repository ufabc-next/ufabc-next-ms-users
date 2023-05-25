import { Schema, model } from 'mongoose';
import { Enrollment } from './zod/EnrollmentSchema';
import { get } from 'lodash';

const enrollmentSchema = new Schema<Enrollment>({
  subject: {
    ref: 'subjects',
  },
  teoria: {
    ref: 'teachers',
  },
  pratica: {
    ref: 'teachers',
  },
  mainTeacher: {
    ref: 'teachers',
  },
});

enrollmentSchema.index({ identifier: 1, ra: 1 });
enrollmentSchema.index({ ra: 1 });
enrollmentSchema.index({ conceito: 1 });
enrollmentSchema.index({
  mainTeacher: 1,
  subject: 1,
  cr_acumulado: 1,
  conceito: 1,
});

function customPreMiddleware(doc: Enrollment) {
  if ('teoria' in doc || 'pratica' in doc) {
    // TODO: refactor this in the morning
    doc.mainTeacher =
      get(doc, 'teoria._id', doc.teoria) || get(doc, 'pratica._id', doc.teoria);
  }
}

export const enrollmentModel = model('Enrollments', enrollmentSchema);
