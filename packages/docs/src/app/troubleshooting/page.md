---
title: Troubleshooting
---

## Napi::Error

This issue may occur if you did a custom manual installation or if you skipped the `vitest.config.js` overwriting set in our automated install. Please make sure that:

1. The file `vitest.config.js` exists at the top level of your project.
2. It contains the key-value `pool: "forks"`. If not, add it.

For an example of what a good Poyro Vitest configuration should look like, see [this example](/manual-installation#basic-configuration).

## Test timeout exceeded

Since Poyro runs an LLM locally, depending on your hardware tests make take longer than the default timeout to run. Try increasing the timeout in the third argument of the `it`/`test` function. Additionally, ensure that you `await` the matcher call, as it is asynchronous.

If this does not work, your computer seems to slow down, or tests hang please see the [Tests or Computer Hang](#tests-or-computer-hang) section below for other potential fixes.

## Not seeing errors for all tests

This issue may occur if you did a custom manual installation or if you skipped the `vitest.config.js` overwriting set in our automated install. Please make sure that:

1. The file `vitest.config.js` exists at the top level of your project.
2. It contains the key-value `reporters: "verbose"` or `reporters: [..., "verbose", ...]`. If not, add it.

For an example of what a good Poyro Vitest configuration should look like, see [this example](/manual-installation#basic-configuration).

## Installation error

If you have any issues with the automated installation script `npx poyro init` try [installing manually](/manual-installation) instead.

## Tests or computer hang

This is typically a symption of RAM or CPU cores being saturated. There are a few remediations to this problem.

### Disable vitest parallelism

This issue may occur if you did a custom manual installation or if you skipped the `vitest.config.js` overwriting set in our automated install. Please make sure that:

1. The file `vitest.config.js` exists at the top level of your project.
2. It contains the key-value `fileParallelism: false`. If not, add it.

For an example of what a good Poyro Vitest configuration should look like, see [this example](/manual-installation#basic-configuration).

### Remove code parallelism

You may also encounter such an error if you attempt to parallelize test with a `Promise.all` or similar construct. Each of these tests will spawn a new instance of the LLM, which can quickly consume memory. In such instances, it is recommended to run the tests serially.

### Reduce memory usage

If you're running on a machine with limited memory, you may run out of memory during the test. Try closing other memory-intensive processes or running the test on a machine with more memory.

### Configure less memory usage

The `contextSize` used by Poyro determines how many tokens (chunks of words) the evaluation LLM reads at a time. By default this is set to 512. You can try reducing this to 256 or 128. Note that depending on the length of the strings you pass to our matchers this may affect the cohesiveness of the evaluation output, so please experiment with how this parameter affects the test results you expect.

To do this create a `poyro.config.js` file at the top of your project and write:

```js
import defineConfig from "@poyro/vitest/config";

export default defineConfig({
  llamaCpp: {
    contextOptions: {
      contextSize: <your-new-context-size>,
    },
  },
});
```

For more information on Poyro configurations see the [Configuration](/configuration) page.

## Can't solve your problem?

You can reach us at our [Discord](https://discord.gg/gmCjjJ5jSf). Give us a detailed description of your problem (e.g. inputs, outputs, logs, system) and we'll be happy to troubleshoot for you!
