import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    projects: [
      { extends: true, test: {
        name: 'ui', environment: 'jsdom', include: ['src/**/*.test.{ts,tsx}'],
        exclude: ['src/core/**', 'src/adapters/**'], setupFiles: './src/test/setup.ts', css: true,
      } },
      { extends: true, test: {
        name: 'contracts', environment: 'node', include: ['src/core/**/*.test.ts', 'src/adapters/**/*.test.ts'],
        setupFiles: './src/test/coreSetup.ts',
      } },
    ],
  },
})
