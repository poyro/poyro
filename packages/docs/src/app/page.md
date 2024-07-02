---
title: Getting started
---

Start testing your LLM integration with Poyro in under 5 minutes. {% .lead %}

{% quick-links %}

{% quick-link title="Quick start" icon="installation" href="#installation" description="Get started quickly with Poyro and begin testing your LLM integration ASAP." /%}

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


### Create your test

To use the matchers, create a file with the extension `.test.ts` anywhere within your project. Here is an example:

```javascript
// MyFirstTest.test.ts
import { expect, it } from "vitest";

it("should be true", async () => {
  // Replace this with your LLM app's output
  const llmOutput = "Hello, world!";

  // Criterion in natural language: True or False
  await expect(llmOutput).toFulfillCriterion("Says hello");
}, 10000); // Increase the timeout as needed with the third argument
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

## Troubleshooting

{% callout type="note" title="Pro tip" %}
`npm test` is an alias for the `vitest` CLI. As seen below, this CLI provides many ways to configure how tests are run which are useful for getting the most out of Poyro. See the [Vitest CLI docs](https://vitest.dev/guide/cli.html) to learn more about them.
{% /callout %}


### Napi::Error

By default test execution uses threads to run tests, which is more resource efficient but provides more opaque errors. The best way to debug this issue is to use `npm test` with forks instead:

```bash
npm test --pool=forks
```

### Test timeout exceeded

Since Poyro runs an LLM locally, depending on your hardware tests make take longer than the default timeout to run.

Try increasing the timeout in the third argument of the `it`/`test` function. Additionally, ensure that you `await` the matcher call, as it is asynchronous.


### Not seeing errors for all tests

The default logging for vitest can hide all but the last test error. To display all test errors we recommend using:

```bash
npm test --reporter=verbose
```

### Installation error

If you have any issues with the automated installation script `npx poyro init` try [installing manually](/manual-installation) instead. A successful installation should yield a message that roughly looks like:

```bash
poyro | Welcome to Poyro! 🕵️
? vitest is not installed. Would you like to also install it? yes
poyro | Installing vitest and @poyro/vitest...

added 2 packages, removed 2 packages, changed 2 packages, and audited 611 packages in 9s

203 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
poyro | No 'vitest.setup.js/ts' file found. Creating vitest.setup.js...
poyro | vitest.setup.js created successfully.
poyro | No 'vitest.config.js/ts' file found. Creating vitest.config.js...
poyro | vitest.config.js created successfully.
poyro | vitest.d.ts created successfully.
poyro | tsconfig.json updated successfully to reference vitest.d.ts types.
```


### Out of memory

If you're running on a machine with limited memory, you may run out of memory during the test. Try closing other memory-intensive processes or running the test on a machine with more memory.

Additionally, you may also receive such an error if you attempt to parallelize test with a `Promise.all` or similar construct. Each of these tests will spawn a new instance of the LLM, which can quickly consume memory. In such instances, it is recommended to run the tests serially.

---

## Help

### Submit an issue

You can submit an issue by going to our GitHub repository and [creating a new issue](https://github.com/poyro/poyro/issues/new). Prior to submitting an issue, please check if a similar issue has already been submitted.

### Join the community

If you want to get help, brainstorm on good evals, or if you just want to chat with other Poyro developers, join our community on [Discord](https://discord.gg/gmCjjJ5jSf)!
