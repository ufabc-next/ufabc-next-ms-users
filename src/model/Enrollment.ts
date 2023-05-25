import { Schema, model } from 'mongoose';
import { get } from 'lodash';
import { Enrollment } from './zod/EnrollmentSchema';
import { GroupModel } from './Group';

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
  if ('teoria' in doc || 'teoria' in doc) {
    // TODO: refactor this in the morning
    doc.mainTeacher =
      get(doc, 'teoria._id', doc.teoria) || get(doc, 'pratica._id', doc.teoria);
  }
}

enrollmentSchema.pre('save', async function () {
  customPreMiddleware(this);

  await addEnrollmentToGroup(this);
});

async function addEnrollmentToGroup(doc: Enrollment) {
  /*
   * If is a new enrollment, must create a new
   * group or insert doc.ra in group.users
   */

  if (doc.mainTeacher && doc.isNew) {
    await GroupModel.updateOne(
      {
        disciplina: doc.disciplina,
        season: doc.season,
        mainTeacher: doc.mainTeacher,
      },
      {
        $push: { users: doc.ra },
      },
      {
        upsert: true,
      },
    );
  }
}

export const EnrollmentModel = model('Enrollments', enrollmentSchema);
