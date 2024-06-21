# @poyro/vitest

## 0.2.2

### Patch Changes

- c7ce42a: Fix exports in package.json. Given the change of `tsconfig.json` to target `ES2022`, pointing `main` to `dist/index.mjs` is incorrect. Instead, point `main` to `dist/index.js` and `types` to `dist/index.d.ts`.

## 0.2.1

### Patch Changes

- 2f00bc3: Remove installing the evaluation model as part of the `postinstall` script to improve performance and DX. Now, the evaluation model is installed on the first run of `vitest` following the configuration of the package.
- edfc90e: Improve testing by co-locating tests within the `@poyro/vitest` package rather than relying on a demo app. This will allow us to test the package in isolation and ensure that it works as expected.

  To continue to test a "real-world" example, we will dogfood using our `nextjs-vitest-poyro-demo` repo. This will allow us to ensure that the package also works as expected in a real-world scenario.

## 0.2.0

### Minor Changes

- f67bbec: Upgrade to node llama 3 beta

## 0.1.4

### Patch Changes

- Update README.md for `@poyro/vitest` to mention that `tsconfig.json` should be updated to reference `vitest.d.ts`.

  Also fix some minor linting issues.

## 0.1.3

### Patch Changes

- Moved `handlebars` to be a dependency for easier installation. Fixed some linting issues. Import handlebars as a singleton to avoid CJS/ESM compatibility issues.

## 0.1.2

### Patch Changes

- Ensure that `node-fetch` is correctly marked as a dependency, not a devDependency.

## 0.1.1

### Patch Changes

- This change ensures that the scripts directory is bundled with the package. This is necessary for the package to work correctly.

  It also makes minor linting changes.

## 0.1.0

### Minor Changes

- 4b2a980: This first published version creates the `@poyro/vitest` package, which provides LLM-specific matchers for unit testing on Vitest. These matchers are used to test the output of LLMs.

  Our first matcher is `toFulfillCriterion`, which is used to evaluate the output of an LLM against a binary criterion. The matcher takes the LLM output via the `expect` function, a criterion to evaluate the output against, and an optional additional context to further define. The matcher then determines whether the output meets the criterion and provides feedback based on the result if not.

  To install `@poyro/vitest`, check out the README in the package folder for instructions.
