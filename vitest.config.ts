import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: [
      '**/__tests__/unit/**/*.{test,spec}.ts',
      '**/__tests__/**/*.unit.{test,spec}.ts',
      '**/__tests__/integration/**/*.{test,spec}.ts',
    ],
    name: 'unit',
    environment: 'node',
  },
})
