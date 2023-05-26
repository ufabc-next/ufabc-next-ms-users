import {
  Document,
  Query,
  Schema,
  Types,
  isObjectIdOrHexString,
  model,
} from 'mongoose';
import { Reaction } from './zod/ReactionSchema';
import { UserModel } from './User';
import { CommentModel } from './Comment';
import { EnrollmentModel } from './Enrollment';

type ReactionDocument = Document & Reaction;
// I REALLY need to type this better
type ReactionQuery = Reaction & Query<{}, {}>;

const reactionSchema = new Schema<Reaction>({
  comment: {
    type: Types.ObjectId,
    ref: 'comments',
  },
  user: {
    type: Types.ObjectId,
    ref: 'users',
  },
});

reactionSchema.pre('save', async function (this: ReactionDocument) {
  // Validate if reaction is equal
  console.log('give me refs', {
    user: this.user,
    comment: this.comment,
  });
  const slug = `${this.kind}:${this.comment._id}:${this.user._id}`;
  if (this.isNew) {
    // @ts-ignore the type here is `ReactionModel`
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

async function validateRules(reaction: ReactionDocument) {
  if (reaction.kind === 'recommendation') {
    const isValidId = isObjectIdOrHexString;
    const user = isValidId(reaction.user)
      ? await UserModel.findById(reaction.user)
      : reaction.user;
    const comment = isValidId(reaction.comment)
      ? await CommentModel.findById(reaction.comment)
      : reaction.comment;
    const isValid = await EnrollmentModel.findOne({
      ra: user?.ra,
      $or: [{ teoria: comment?.teacher }, { pratica: comment?.teacher }],
    });

    if (!isValid) {
      throw new Error(
        'Você não pode recomendar este comentário, pois não fez nenhuma matéria com este professor',
      );
    }
  }
}

reactionSchema.post('save', async function () {
  computeReactions(this);
});

reactionSchema.post('deleteOne', async function (this: ReactionQuery) {
  computeReactions(this);
});

async function computeReactions(reaction: ReactionDocument | ReactionQuery) {
  const commentId = reaction.comment._id || reaction.comment;
  await CommentModel.findOneAndUpdate(
    {
      _id: commentId,
    },
    {
      [`reactionsCount.${reaction.kind}`]:
        // @ts-ignore the type here is `ReactionModel`
        await reaction.constructor.countDocuments({
          comment: commentId,
          kind: reaction.kind,
        }),
    },
  );
}

reactionSchema.index({ comment: 1, kind: 1 });

export const ReactionModel = model('Reactions', reactionSchema);
