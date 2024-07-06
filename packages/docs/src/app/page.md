---
title: Getting started
---

Start testing your LLM integration with Poyro in under 5 minutes. {% .lead %}

{% quick-links %}

{% quick-link title="Quick start" icon="installation" href="#usage" description="Get started quickly with Poyro and begin testing your LLM integration ASAP." /%}

{% quick-link title="How does it work?" icon="presets" href="/how-does-it-work" description="Learn how the internals work." /%}

<!-- {% quick-link title="API reference" icon="plugins" href="/" description="Use advanced utilities to test your app the right way." /%} -->

{% /quick-links %}

## Poyro

### What is it?

Poyro is a lightweight extension of [Vitest](https://vitest.dev/) (a modern testing framework with a Jest-like API) for testing LLM applications. Familiarizing yourself with Vitest can help you get more out of Poyro.

### Prerequisites

- Node.js 20 or later
- Vitest 1.6.0 or later
- Your project must have "type": "module" in its package.json (this library is ESM only)
- Recommended: CUDA-compatible GPU (Nvidia) or Metal-compatible GPU (Apple Silicon) for best performance, but not required

---

## Usage

### Install

To get started quickly, simply run:

```bash
npx poyro init
```

### Create your first test

To use the matchers, create a file with the extension `.test.ts` anywhere within your project. Here is an example:

```javascript
// MyFirstTest.test.ts
import { describe, expect, it } from "vitest";

describe("MyFirstTest", () => {
  it("should be true", async () => {
    // Replace this with your LLM app's output
    const llmOutput = "Hello, world!";

    // Criterion in natural language: True or False
    await expect(llmOutput).toFulfillCriterion("Says hello");
  }, 10000); // Increase the timeout as needed with the third argument
});
```

`toFulfillCriterion` can determine whether an LLM output meets or does not meet a natural language criterion.

{% callout type="note" title="Note" %}
Poyro uses its own [small, locally run LLM](/how-does-it-work#how-is-it-free) to do its evaluations. The first time you run a test like the one above, the model file will be downloaded. It should take a couple of minutes.
{% /callout %}

### Run your test

Run vitest with your package manager, for example with `npm`:

```bash
npm test
```

Similar commands work with `yarn` and `pnpm`.

---

## Help

### Troubleshooting

We provide solutions to common issues in our [Troubleshooting](/troubleshooting) page. Take a look at the solutions there, and if you continue to run into problems please don't hesitate to reach out to us.

### Submit an issue

You can submit an issue by going to our GitHub repository and [creating a new issue](https://github.com/poyro/poyro/issues/new). Prior to submitting an issue, please check if a similar issue has already been submitted.

### Join the community

If you want to get help, brainstorm on good evals, or if you just want to chat with other Poyro developers, join our community on [Discord](https://discord.gg/gmCjjJ5jSf)!
