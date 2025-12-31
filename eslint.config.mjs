import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts'
  ]),
  {
    rules: {
      // Enable unused vars detection (allows _ prefix for intentionally unused)
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      // Warn on explicit any usage (error would break build during migration)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Prevent console.log in production (allow warn/error)
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // Performance: avoid useless fragments
      'react/jsx-no-useless-fragment': 'warn'
    }
  }
]);

export default eslintConfig;
