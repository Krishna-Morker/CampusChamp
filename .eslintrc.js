// .eslintrc.js
module.exports = {
    root: true,
    extends: ['next/core-web-vitals', /* any other configs you use */],
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // your global rules…
    },
    overrides: [
      // Turn NO‑REQUIRE‑IMPORTS off for plain JS
      {
        files: ['*.js'],
        rules: {
          '@typescript-eslint/no-require-imports': 'off',
        },
      },
      // Keep the rule for TS/TSX files
      {
        files: ['*.ts', '*.tsx'],
        parser: '@typescript-eslint/parser',
        plugins: ['@typescript-eslint'],
        rules: {
          '@typescript-eslint/no-require-imports': 'error',
        },
      },
    ],
  };
  