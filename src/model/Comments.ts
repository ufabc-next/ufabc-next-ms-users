import { Schema } from 'mongoose';
import { Comments } from './zod/CommentsSchema';

const commentSchema = new Schema<Comments>(
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
