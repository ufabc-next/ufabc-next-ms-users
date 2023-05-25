import { Schema } from 'mongoose';
import { Subject } from './zod/SubjectsSchema';

const subjectSchema = new Schema<Subject>();

subjectSchema.pre('save', function () {
  this.search = '';
});
