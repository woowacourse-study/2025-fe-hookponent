import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

/**
 * https://eslint.org/docs/latest/use/configure/configuration-files-new#glob-patterns
 */
export default [
  {
    files: ['packages/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // ✅ Jest
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',

        // ✅ Node
        require: 'readonly',
        module: 'readonly',

        // ✅ JSX (for React 17+ automatic runtime)
        React: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'import/order': ['warn', { alphabetize: { order: 'asc' } }],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettier,
];
