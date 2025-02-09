/** @type {import('eslint').Linter.Config[]} */
const js = require('@eslint/js')
const pluginJest = require('eslint-plugin-jest')
const globals = require('globals')
const stylisticJs = require('@stylistic/eslint-plugin-js')

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
        ...pluginJest.environments.globals.globals
      },
      ecmaVersion: 'latest',
    },
    ignores: ['dist/**'],
    plugins: {
      '@stylistic/js': stylisticJs,
      jest: pluginJest
    },
    rules: {
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
