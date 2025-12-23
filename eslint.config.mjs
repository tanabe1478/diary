import { defineConfig } from 'eslint/config'
import nextConfig from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = defineConfig([
  // Apply Next.js recommended rules
  ...nextConfig,

  // Disable formatting rules that conflict with Prettier
  prettierConfig,

  // Global ignores
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'node_modules/**',
      '.git/**',
      'coverage/**',
    ],
  },
])

export default eslintConfig
