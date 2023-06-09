import { Schema, model } from 'mongoose';
import { startCase, camelCase } from 'lodash';
import { Teacher } from './zod/TeacherSchema';

const teacherSchema = new Schema<Teacher>({
  name: String,
  alias: [String],
});

teacherSchema.pre('save', function () {
  this.name = startCase(camelCase(this.name));
});

export const TeacherModel = model('Teachers', teacherSchema);
