import { PipelineStage } from 'mongoose';
import { DisciplinaModel } from '@/model/Disciplina';
import { UserModel } from '@/model/User';
import { StudentModel } from '@/model/Student';
import { CommentModel } from '@/model/Comment';
import { EnrollmentModel } from '@/model/Enrollment';
import { buildApp } from '@/app';

export async function nextUsageInfo() {
  const teacherAggregationQueryCount: PipelineStage.FacetPipelineStage[] = [
    {
      $group: {
        _id: null,
        teoria: { $addToSet: '$teoria' },
        pratica: { $addToSet: '$pratica' },
      },
    },
    { $project: { teachers: { $setUnion: ['$teoria', '$pratica'] } } },
    { $unwind: { path: '$teachers', preserveNullAndEmptyArrays: true } },
    { $group: { _id: null, total: { $sum: 1 } } },
    { $project: { _id: 0 } },
  ];
  const subjectsAggregationQueryCount: PipelineStage.FacetPipelineStage[] = [
    {
      $group: { _id: null, total: { $sum: 1 } },
    },
    { $project: { _id: 0 } },
  ];
  const isBeforeKick = await DisciplinaModel.count({
    before_kick: { $exists: true, $ne: [] },
  });
  const dataKey = isBeforeKick ? '$before_kick' : '$alunos_matriculados';
  const studentAggregationQueryCount: PipelineStage.FacetPipelineStage[] = [
    {
      $unwind: dataKey,
    },
    { $group: { _id: null, alunos: { $addToSet: dataKey } } },
    { $unwind: '$alunos' },
    { $group: { _id: null, total: { $sum: 1 } } },
  ];
  const disciplinaStatsFacetQuery = [
    {
      $facet: {
        teachers: teacherAggregationQueryCount,
        subjects: subjectsAggregationQueryCount,
        studentTotal: studentAggregationQueryCount,
      },
    },
    {
      $addFields: {
        teachers: { $ifNull: [{ $arrayElemAt: ['$teachers.total', 0] }, 0] },
        totalAlunos: {
          $ifNull: [{ $arrayElemAt: ['$totalAlunos.total', 0] }, 0],
        },
        subjects: { $ifNull: [{ $arrayElemAt: ['$subjects.total', 0] }, 0] },
      },
    },
  ];

  try {
    const app = await buildApp();
    const [users, currentStudents, comments, enrollments, [disciplinaStats]] =
      await Promise.all([
        UserModel.count({}),
        StudentModel.count({}),
        CommentModel.count({}),
        EnrollmentModel.count({
          conceito: { $in: ['A', 'B', 'C', 'D', '0', 'F'] },
        }),
        DisciplinaModel.aggregate(disciplinaStatsFacetQuery),
      ]);

    const [allStudents] = disciplinaStats.studentTotal.map(
      ({ total }: { total: number; _id: null }) => total,
    );

    const CACHE_KEY = `usage-service`;

    await app.redis.set(
      CACHE_KEY,
      JSON.stringify({
        teachers: disciplinaStats.teachers,
        studentTotal: allStudents,
        subjects: disciplinaStats.subjects,
        users,
        currentStudents,
        comments,
        enrollments,
      }),
      'EX',
      60 * 60,
    );

    const cached = await app.redis.get(CACHE_KEY);

    if (cached) return cached;

    return {
      teachers: disciplinaStats.teachers,
      studentTotal: allStudents,
      subjects: disciplinaStats.subjects,
      users,
      currentStudents,
      comments,
      enrollments,
    };
  } catch (error) {
    console.error('Error fetching database', error);
    throw error;
  }
}
