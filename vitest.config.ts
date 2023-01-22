/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  mode: 'library',
  test: {
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
})
