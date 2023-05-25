import { Schema } from 'mongoose';
import { startCase, camelCase } from 'lodash';
import { Subject } from './zod/SubjectsSchema';

const subjectSchema = new Schema<Subject>();

subjectSchema.pre('save', function () {
  this.search = startCase(camelCase(this.name));
});
