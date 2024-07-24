# Poyro

[![npm version](https://badge.fury.io/js/%40poyro%2Fvitest.svg)](https://badge.fury.io/js/%40poyro%2Fvitest) | [![docs](https://img.shields.io/badge/poyro-docs-blue)](https://docs.poyro.dev) | [![Discord](https://img.shields.io/discord/1250274948233039883?logo=discord&label=Discord)](https://discord.gg/gmCjjJ5jSf)

## What is Poyro?

Poyro is a lightweight extension of [Vitest](https://vitest.dev/) (a modern testing framework with a Jest-like API) for testing LLM applications. Familiarizing yourself with Vitest can help you get more out of Poyro.

Poyro follows the best practice of using LLMs to evaluate the outputs of your application LLM. Poyro converts natural language conditions into binary unit tests. Unit testing should be free and open source by default -- that includes AI apps -- so we [use a locally run small LLM](https://docs.poyro.dev/how-does-it-work) to evaluate your application's outputs.

For more context on why to use Poyro and examples on how to use it along with Vitest to unit test LLM apps, read our essays:

- [AI Testing as part of Full-Stack Engineering](https://docs.poyro.dev/essays/ai-testing-as-part-of-fullstack-engineering)
- [How To Write Unit Tests for Your AI Web App](https://docs.poyro.dev/essays/how-to-write-unit-tests-for-ai-web-app)
- [Case Study - Unit Testing a Legal AI App](https://docs.poyro.dev/essays/unit-testing-a-legal-ai-app)
  - [Runnable code examples for this article](https://github.com/poyro/unit-test-legal-ai-demo)

## Prerequisites

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

The first time you run a test like the one above, the model file for our locally run LLM will be downloaded. It should take a couple of minutes.

### Run your test

Run vitest with your package manager, for example with `npm`:

```bash
npm test
```

Similar commands work with `yarn` and `pnpm`.

---

## Help

### Troubleshooting

We provide solutions to common issues in our [Troubleshooting](https://docs.poyro.dev/troubleshooting) page. Take a look at the solutions there, and if you continue to run into problems please don't hesitate to reach out to us.

### Submit an issue

You can submit an issue by going to our GitHub repository and [creating a new issue](https://github.com/poyro/poyro/issues/new). Prior to submitting an issue, please check if a similar issue has already been submitted.

### Join the community

If you want to get help, brainstorm on good evals, or if you just want to chat with other Poyro developers, join our community on [Discord](https://discord.gg/gmCjjJ5jSf)!


## Contributing

If you would like to contribute to Poyro, please read our [contributing guide](CONTRIBUTING.md).

Begin by cloning the repository:

```bash
git clone https://github.com/poyro/poyro.git
```

Next, install all the dependencies:

```bash
pnpm install
```

When developing, you can either run `pnpm dev` at the root, which will automatically build all relevant packages when changes are made, or you can run `pnpm dev` within the package you are working on.
