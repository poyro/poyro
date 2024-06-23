---
"@poyro/vitest": minor
"poyro": minor
---

This PR does three main things. First, it refactors the matchers into a shared singleton that is loaded by Vitest. This allows the matchers to share the model and avoid reinstantiating it for each test.

Second, it adds context-based caching via the singleton. This allows the matchers to cache the results of the last match for each context, which can be used to avoid re-creating the model each time it is accessed.

Finally, it switches to a Llama-3 Instruct model for the matchers. This allows the overall performance of the testing suite to be improved both in terms of quality and execution speed.
