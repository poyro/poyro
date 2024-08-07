---
title: outputFulfillsCriterion
nextjs:
  metadata:
    title: outputFulfillsCriterion
    description: Learn how to use the outputFulfillsCriterion function in Poyro.
---

{% callout type="note" title="Async function" %}
Please note that `outputFulfillsCriterion` is an async function. To get the actual return you need to `await` this function. If not using a machine with large RAM or GPU it is recommended multiple calls to this function are ran synchronously and sequentially.
{% /callout %}

The `outputFulfillsCriterion` function compares an output and a criterion to determine whether the criterion holds for the output. It is the functional version of the `toFulfillCriterion` matcher. It is useful when we want to use this method without chaining with expect. For example:

- If we want to check that one of many outputs fulfill a criterion.
- If we want to check that all outputs fulfill a criterion.
- if we want to check that at least some percentage of outputs fullfil a criterion.

```tsx
(output: string, criterion: string, additionalContext?: string) =>
  Promise<FeedbackObject>;
```

## Parameters

| Name                | Type   | Required | Description                                                   |
| ------------------- | ------ | -------- | ------------------------------------------------------------- |
| `output`            | string | **yes**  | The output to be evaluated.                                   |
| `criterion`         | string | **yes**  | The binary criterion to match against.                        |
| `additionalContext` | string | no       | An optional way to provide additional context to the matcher. |

## `FeedbackObject`

### Properties

| Name       | Type    | Description                   |
| ---------- | ------- | ----------------------------- |
| `feedback` | string  | The feedback message.         |
| `result`   | boolean | The result of the comparison. |

## Usage

### Basic usage

The following is a simple example of how to use the `outputFulfillsCriterion` function:

```js
import { describe, it, expect } from "vitest";
import { outputFulfillsCriterion } from "@poyro/vitest/fn";

describe("generateRecipeUsingAi", () => {
  it("should generate an italian recipe at least once", async () => {
    let generatedItalianRecipe = false;

    // Run sequentially to be conservative with RAM utilization
    for (let i = 0; i < 3; i++) {
      const recipe = await generateRecipeUsingAi();

      const generatedItalianRecipe = await outputFulfillsCriterion(
        recipe,
        "Is an italian recipe"
      );

      if (generatedItalianRecipe) {
        break;
      }
    }

    expected(generatedItalianRecipe).toBe(true);
  });
});
```

This example checks whether _at least one_ of the three recipes generated is an Italian recipe.
