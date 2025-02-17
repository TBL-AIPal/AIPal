const js = require('@eslint/js');
const pluginJest = require('eslint-plugin-jest');
const securityPlugin = require('eslint-plugin-security');
const prettierPlugin = require('eslint-plugin-prettier');
const globals = require('globals');

module.exports = [
  // Base configuration
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // File-pattern specific overrides
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'bin', 'test'],
    rules: {
      'no-console': 'error',
    },
  },
  {
    files: ['tests/**/*'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    rules: {
      'no-console': 'off',
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
  // Custom rules
  {
    rules: {
      'func-names': 'off',
      'no-underscore-dangle': 'off',
      'consistent-return': 'off',
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Security plugin configuration
  {
    plugins: {
      security: securityPlugin,
    },
    rules: {
      ...securityPlugin.configs.recommended.rules,
      'security/detect-object-injection': 'off',
    },
  },
  // Prettier plugin configuration
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },
];
