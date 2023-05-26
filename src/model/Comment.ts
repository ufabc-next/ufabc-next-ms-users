import { Schema, Types, model } from 'mongoose';
import { Comment } from './zod/CommentSchema';

const commentSchema = new Schema<Comment>(
  {
    enrollment: {
      type: Types.ObjectId,
      ref: 'enrollments',
    },
    teacher: {
      type: Types.ObjectId,
      ref: 'teachers',
    },
    subject: {
      type: Types.ObjectId,
      ref: 'subjects',
    },
  },
  { toObject: { virtuals: true } },
);

commentSchema.pre('save', async function () {
  if (this.isNew) {
    //
    const enrollment = await this.constructor
      // @ts-ignore
      // This one here, it only work, if in your service, you create a instance of `CommentModel`
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
