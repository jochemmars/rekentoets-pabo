import { defineConfig } from 'vitest/config';

export default defineConfig({
  // GitHub Pages serveert de app onder /rekentoets-pabo/
  base: '/rekentoets-pabo/',
  build: { target: 'es2020', sourcemap: true },
  test: {
    include: ['tests/golden/**/*.test.ts', 'tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
