# @poyro/vitest

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
