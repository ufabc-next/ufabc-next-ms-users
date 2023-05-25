import { Schema, model } from 'mongoose';
import { Comment } from './zod/CommentSchema';

const commentSchema = new Schema<Comment>(
  {
    enrollment: {
      ref: 'enrollments',
    },
    teacher: {
      ref: 'teachers',
    },
    subject: {
      ref: 'subjects',
    },
  },
  { toObject: { virtuals: true } },
);

commentSchema.pre('save', async function () {
  if (this.isNew) {
    const enrollment = await this.constructor
      .findOne({
        enrollment: this.enrollment,
        active: true,
        type: this.type,
      })
      .lean(true);

    if (enrollment) {
      throw new Error(
        `Você só pode comentar uma vez neste vinculo ${this.enrollment}`,
      );
    }
  }
});

export const CommentModel = model('Comments', commentSchema);
