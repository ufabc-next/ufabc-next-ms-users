import { Schema, model } from 'mongoose';
import { startCase, camelCase } from 'lodash';
import { Subject } from './zod/SubjectSchema';

const subjectSchema = new Schema<Subject>({
  creditos: Number,
  name: String,
  search: String,
});

subjectSchema.pre('save', function () {
  this.search = startCase(camelCase(this.name));
});

export const SubjectModel = model('Subjects', subjectSchema);
