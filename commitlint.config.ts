const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refac',
        'revert',
        'style',
        'test',
      ],
    ],
  },
};
// eslint-disable-next-line import/no-default-export
export default commitlintConfig;
