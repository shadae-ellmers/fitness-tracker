import { defineConfig, globalIgnores } from 'eslint/config'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default defineConfig(
  [
    globalIgnores([
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/generated/**',
      '**/*.js',
    ]),
  ],
  tseslint.config({
    files: ['**/*.{ts,tsx}'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: new URL('.', import.meta.url).pathname,
        project: './tsconfig.json',
      },
    },
  })
)
