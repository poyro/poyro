---
title: outputFulfillsCriterion
nextjs:
  metadata:
    title: outputFulfillsCriterion
    description: Learn how to use the outputFulfillsCriterion function in Poyro.
---

{% callout type="note" title="Async matcher" %}
Please note that the `toFulfillCriterion` matcher is an async function. If you have a machine with no GPU or a GPU with small RAM use await to run async.
{% /callout %}

The `outputFulfillsCriterion` function compares an output and a criterion to determine whether the criterion holds for the output. It is the functional version of the `toFulfillCriterion` matcher. It is useful when we want to use this method without chaining with expect. For example:

- If we want to check that one of many outputs fulfill a criterion.
- If we want to check that all outputs fulfill a criterion.
- if we want to check that at least some percentage of outputs fullfil a criterion.

```tsx
(output: string, criterion: string, additionalContext?: string) => Promise<void>;
```

When resolved the promise returns an object with schema:

```json
{
  "type": "object",
  "properties": {
    "feedback": {
      "type": "string",
      "description": "A natural language description for the reasoning behind the conclusion."
    },
    "result": {
      "type": "boolean",
      "description": "Is the criterion met or not, given the output and context?"
    },
  },
}
```

## Parameters

| Name                | Type   | Required | Description                                                   |
| ------------------- | ------ | -------- | ------------------------------------------------------------- |
| `output`            | string | **yes**  | The output to be evaluated.                                   |
| `criterion`         | string | **yes**  | The binary criterion to match against.                        |
| `additionalContext` | string | no       | An optional way to provide additional context to the matcher. |

## Usage

### Basic usage

The following is a simple example of how to use the `toFulfillCriterion` matcher:

```typescript
import { describe, it, expect } from "vitest";
import { fn } from "@poyro/vitest/fn";

describe("generateRecipeUsingAi", () => {
  it("should generate an italian recipe at least once", async () => {
    var generatedItalianRecipe = false;
    for(let i = 0; i < 3; i++) {
      const recipe = await generateRecipeUsingAi();
      const generatedItalianRecipe = outputFulfillsCriterion(recipe, "Is an italian recipe");

      if(generatedItalianRecipe){
        break;
      }
    }

    expected(generatedItalianRecipe).toBe(true);
  });
});
```

This example checks whether at least one of the three recipes generated is an italian recipe.
