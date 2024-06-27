---
"@poyro/vitest": patch
---

Fix the prompt used for evaluation with current matcher

The issue raised was that in some tests the evaluation model's reasoning would contradict the boolean returned by it. This boolean is what is used by the matcher to determine whether the test passes or fails. The feedback provided by the model and the booelan returned should always be consistent with one another.

Upon inspection, we found that the actual system prompt we used had several issues:

- It was overly long and complicated.
- It made references to artifacts from Prometheus that were not relevant to the model currently used by Poyro.
- It did not explicitly instruct the model to not contradict itself.
- It did not directly instruct the feedback to make a clear True / False determination.

We created a simplified system prompt and it works with our smaller Llama-3 model in Poyro with the test case that produced the issue. To validate the prompt change did not improve only this test case by chance we submitted the original, long prompt to GPT, meta.ai (full Llama), and Perplexity. GPT and meta.ai show the same error as the smaller model with the original prompt, with the boolean contradicting the reasoning. 

Given much more powerful models struggled with the same prompt, but were successful with a simpler prompt this strongly suggested the prompt was the prompt. This is enough evidence both from a first principles and empirical perspective to update the prompt to the new one. Speaking with current users, there were no reversions introduced into their existing tests due to the prompt change, only progressions.
