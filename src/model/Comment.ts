import { Schema, Types, model } from 'mongoose';
import { Comment } from './zod/CommentSchema';
import { EnrollmentModel } from './Enrollment';
import { ReactionModel } from './Reaction';

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

commentSchema.post('save', async function () {
  await EnrollmentModel.findOneAndUpdate(
    { _id: this.enrollment },
    { $addToSet: { comments: [this.type] } },
  );
});

commentSchema.post('find', async function () {
  await this.model.updateMany(this.getQuery(), { $inc: { viewers: 1 } });
});

commentSchema.static(
  'commentsByReactions',
  async function (
    query,
    userId,
    populateFields = ['enrollment', 'subject'],
    limit = 10,
    page = 0,
  ) {
    if (!userId) {
      throw new Error(`Usuário Não Encontrado ${userId}`);
    }

    const response = await this.find(query)
      .lean(true)
      .populate(populateFields)
      .skip(page * limit)
      .limit(limit)
      .sort({
        'reactionsCount.recommendation': -1,
        'reactionsCount.likes': -1,
        createdAt: -1,
      });
    await Promise.all(
      // TODO: refactor this monster
      response.map(async (r: any) => {
        r.myReactions = {
          like: !!(await ReactionModel.count({
            comment: String(r._id),
            user: String(userId),
            kind: 'like',
          })),
          recommendation: !!(await ReactionModel.count({
            comment: String(r._id),
            user: String(userId),
            kind: 'recommendation',
          })),
          star: !!(await ReactionModel.count({
            comment: String(r._id),
            user: String(userId),
            kind: 'star',
          })),
        };
        return r;
      }),
    );

    return { data: response, total: await this.count(query) };
  },
);

commentSchema.index({ comment: 1, user: 1 });
commentSchema.index({ reactionsCount: -1 });

commentSchema.index({
  'reactionsCount.recommendation': -1,
  'reactionsCount.likes': -1,
  createdAt: -1,
});

export const CommentModel = model('Comments', commentSchema);
