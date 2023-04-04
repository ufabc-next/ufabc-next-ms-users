import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';
// eslint-disable-next-line
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'c8',
    },
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
