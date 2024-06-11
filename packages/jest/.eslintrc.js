/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/jest.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  overrides: [
    {
      files: ["**/src/**/*"],
      env: {
        jest: true,
      },
    },
  ],
};
