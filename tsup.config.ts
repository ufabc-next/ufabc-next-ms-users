import { defineConfig } from 'tsup';

// eslint-disable-next-line
export default defineConfig({
  entry: ['src/**/*.ts', '!src/helpers/types', '!src/helpers/populate'],
  target: ['node16'],
  // optional to be discussed
  // minify: true,
  clean: true,
  env: {
    NODE_ENV: 'production',
  },
  treeshake: true,
});
