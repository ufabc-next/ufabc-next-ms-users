const commitlintConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['refac']],
  },
};
// eslint-disable-next-line import/no-default-export
export default commitlintConfig;
