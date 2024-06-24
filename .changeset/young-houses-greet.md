---
"@poyro/vitest": patch
"poyro": patch
---

When there's an error in the `toFulfillCriterion` call, it may not be immediately clear which message is the actual one vs a description of the expected one. This change makes that distinction clearer.
