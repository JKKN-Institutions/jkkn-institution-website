import { defineConfig } from 'vitest/config'
import path from 'node:path'

// Unit tests only. Playwright (tests/e2e) stays on `npm run test`.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.test.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname) },
  },
})
