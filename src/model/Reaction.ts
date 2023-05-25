import { Document, FlatRecord, Schema, isObjectIdOrHexString } from 'mongoose';
import { Reaction } from './zod/ReactionSchema';
import { UserModel } from './User';
import { CommentModel } from './Comment';
import { EnrollmentModel } from './Enrollment';

const reactionSchema = new Schema<Reaction>({
  comment: {
    ref: 'comments',
  },
  user: {
    ref: 'users',
  },
});

reactionSchema.pre('save', async function () {
  // Validate if reaction is equal
  const slug = `${this.kind}:${this.comment._id}:${this.user._id}`;
  if (this.isNew) {
    const equalReaction = await this.constructor.findOne({ slug });
    if (equalReaction) {
      throw new Error(
        'Você não pode reagir duas vezes iguais ao mesmo comentário',
      );
    }
    this.slug = slug;
  }
  await validateRules(this);
});

async function validateRules(
  reaction: Document<unknown, {}, FlatRecord<Reaction>>,
) {
  if (reaction.kind === 'recommendation') {
    const isValidId = isObjectIdOrHexString;
    const user = isValidId(reaction.user)
      ? await UserModel.findById(reaction.user)
      : reaction.user;
    const comment = isValidId(reaction.comment)
      ? await CommentModel.findById(reaction.comment)
      : reaction.comment;
    const isValid = await EnrollmentModel.findOne({
      ra: user.ra,
      $or: [{ teoria: comment.teacher }, { pratica: comment.teacher }],
    });

    if (!isValid) {
      throw new Error(
        'Você não pode recomendar este comentário, pois não fez nenhuma matéria com este professor',
      );
    }
  }
}
