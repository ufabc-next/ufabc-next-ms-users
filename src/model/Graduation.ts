import { Schema, model } from 'mongoose';
import { Graduation } from './zod/GraduationSchema';

const graduationSchema = new Schema<Graduation>();

graduationSchema.index({ curso: 1, grade: 1 });

export const GraduationModel = model('Graduations', graduationSchema);
