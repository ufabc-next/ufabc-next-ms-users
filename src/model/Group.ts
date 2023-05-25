import { Schema, model } from 'mongoose';
import { Group } from './zod/GroupSchema';

const groupSchema = new Schema<Group>({
  mainTeacher: {
    ref: 'teachers',
  },
});

groupSchema.index({ users: -1 });
groupSchema.index({ mainTeacher: -1, season: -1, disciplina: -1 });

export const GroupModel = model('Groups', groupSchema);
