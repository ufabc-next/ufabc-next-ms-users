import { type Model, Types, Schema, model, Query } from 'mongoose';
import { Disciplina } from './zod/DisciplinaSchema';
import { findQuarter } from '@/helpers/find-quad';

type DisciplinaModel = Model<Disciplina, {}>;

const disciplinaSchema = new Schema<Disciplina, DisciplinaModel>({
  subject: {
    type: Types.ObjectId,
    ref: 'subjects',
  },
  teoria: {
    type: Types.ObjectId,
    ref: 'teachers',
  },
  pratica: {
    type: Types.ObjectId,
    ref: 'teachers',
  },
});

disciplinaSchema.virtual('requisicoes').get(function () {
  return (this.alunos_matriculados || []).length;
});

disciplinaSchema.index({ identifier: 1 });

disciplinaSchema.pre(
  'findOneAndUpdate',
  function (this: Disciplina & Query<{}, {}>) {
    const disciplina = this.getUpdate() as Disciplina;
    console.log('disciplina', disciplina);
    // @ts-ignore The season, come from the referenced tables
    if (!disciplina?.season) {
      const { year, quad } = findQuarter();
      this.year = year;
      this.quad = quad;
    }
  },
);

// eslint-disable-next-line
export const DisciplinaModel = model('Disciplinas', disciplinaSchema);
