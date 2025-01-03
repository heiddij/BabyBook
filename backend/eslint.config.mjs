import globals from "globals"
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin-js'
import jest from 'eslint-plugin-jest'

/** @type {import('eslint').Linter.Config[]} */
export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    ...jest.configs['flat/recommended'],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        jest: true,
      },
      ecmaVersion: "latest",
    },
    ignores: ["dist/**"],
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/prefer-expect-assertions': 'off',
      '@stylistic/js/indent': [
        'error',
        2
      ],
      '@stylistic/js/linebreak-style': [
        'error',
        'unix'
      ],
      '@stylistic/js/quotes': [
        'error',
        'single'
      ],
      '@stylistic/js/semi': [
        'error',
        'never'
      ],
    },
  },
]