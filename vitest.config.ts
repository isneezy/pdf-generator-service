/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'library',
  test: {
    exclude: ['**/node_modules/**', '**/dist/**'],
    coverage: {
      all: true,
      exclude: ['packages/*/dist', 'packages/**/*.spec.ts', '.eslintrc.js', 'vitest.config.ts'],
      reporter: ['lcov', 'text', 'html', 'json'],
    },
  },
})
