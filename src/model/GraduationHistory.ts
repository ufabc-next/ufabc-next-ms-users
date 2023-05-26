import { Schema, Types, model } from 'mongoose';
import type { GraduationHistory } from './zod/GraduationHistorySchema';

const graduationSchema = new Schema<GraduationHistory>({
  graduation: {
    type: Types.ObjectId,
    ref: 'graduation',
  },
});

export const GraduationHistoryModel = model(
  'historiesgraduations',
  graduationSchema,
);
