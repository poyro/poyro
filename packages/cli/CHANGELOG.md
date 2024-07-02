# @poyro/vitest

## 0.4.4

### Patch Changes

- Allow user to update package.json "type" to "module" when configuring Poyro.

## 0.4.3

### Patch Changes

- Ensure that if the user says 'no' to the `Shall we create a new script in package.json to run vitest` prompt, we give them the opportunity to create a custom script name and assign vitest to it.

## 0.4.2

### Patch Changes

- Ensure that the "test" script is overwritten when requested by user.

## 0.4.1

### Patch Changes

- Update READMEs for both `@poyro/vitest` and `poyro` to include a link to the Poyro documentation and Discord, as well as fix a typo.

## 0.4.0

### Minor Changes

- 9c53e4a: Create 'init' command for the CLI. This allows new users to run `npx poyro init` to set up Poyro for a project.

## 0.3.1

### Patch Changes

- 66d61e4: Separate out grammar from `toFulfillCriterion` into its own file within the same object. This will allow for easier maintenance and better separation of concerns.

## 0.3.0

### Minor Changes

- This PR does three main things. First, it refactors the matchers into a shared singleton that is loaded by Vitest. This allows the matchers to share the model and avoid reinstantiating it for each test.

  Second, it adds context-based caching via the singleton. This allows the matchers to cache the results of the last match for each context, which can be used to avoid re-creating the model each time it is accessed.

  Finally, it switches to a Llama-3 Instruct model for the matchers. This allows the overall performance of the testing suite to be improved both in terms of quality and execution speed.

## 0.2.4

### Patch Changes

- Fix README for `@poyro/vitest` to reflect a more accurate example usage. This change is necessary to ensure that users can easily understand how to use the matchers in their tests.

  Also clean up the `toFullfillCriterion` matcher template to ensure that the feedback is concise and clear.

## 0.2.3

### Patch Changes

- We should probably build the package before publishing it. 🤦‍♂️ This will ensure that the packages are actually built prior to being released to NPM.

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
