import { Model, Schema, model } from 'mongoose';
import { Student } from './zod/StudentsSchema';
import { findQuarter } from '@/helpers/findQuad';

type StudentModel = Model<Student, {}, {}>;

const studentSchema = new Schema<Student>();

function setQuarter(doc: Student) {
  const quarter = findQuarter();
  doc.year = quarter.year;
  doc.quad = quarter.quad;
}

studentSchema.pre<Student>('save', function () {
  if (!this.quad) {
    setQuarter(this);
  }
});

studentSchema.pre('findOneAndUpdate', function () {
  // TODO: ask about this _update
  if (!this._update.season) {
    setQuarter(this._update);
  }
});

export const studentModel = model<Student, StudentModel>(
  'Alunos',
  studentSchema,
);
