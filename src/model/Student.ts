import type { Student } from './zod/StudentSchema';
import { type Model, Schema, model } from 'mongoose';
import { findQuarter } from '@/helpers/find-quad';

type StudentModelType = Model<Student, {}, {}>;
// TODO: Actually type  the returned user

const studentSchema = new Schema<Student>({
  ra: { type: Number, required: true, unique: true },
  login: { type: String, required: true, unique: true },
  aluno_id: { type: Number, required: true, unique: true },
  quad: { type: Number, required: true },
  year: { type: Number, required: true },
  quads: { type: Number, required: true },
  cursos: [
    {
      id_curso: { type: Number, required: true },
      nome_curso: { type: String, required: true },
      cp: { type: Number, required: true },
      cr: { type: Number, required: true },
      ind_afinidade: { type: Number, required: true },
      turno: {
        type: String,
        required: true,
        enum: ['matutino', 'noturno', 'vespertino'],
      },
    },
  ],
});

function setQuarter(doc: Student) {
  const quarter = findQuarter();
  doc.year = quarter.year;
  doc.quad = quarter.quad;
}

studentSchema.pre<Student>('save', function () {
  if (!this.year || !this.quad) {
    setQuarter(this);
  }
});

studentSchema.pre('findOneAndUpdate', function () {
  // it's equivalent to this._update, but without type errors
  // TODO: understand types so i don't use `as`
  const updatedStudent = this.getUpdate() as Student;
  if (!updatedStudent?.quads) {
    setQuarter(updatedStudent);
  }
});

export const StudentModel = model<Student, StudentModelType>(
  'Alunos',
  studentSchema,
);
