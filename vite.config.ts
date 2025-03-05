import { loadEnv } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => ({
  plugins: [tsConfigPaths()],
  test: {
    env: loadEnv(mode, process.cwd(), ''),
    // The 'environmentMatchGlobs' is used for create E2E tests.
    // environmentMatchGlobs: [['src/http/controllers/**', 'prisma']],
  },
}));
