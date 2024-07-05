---
title: Configuration
nextjs:
  metadata:
    title: Configuration
    description: Learn how to configure Poyro for your project.
---

Poyro uses sane defaults for its underlying libraries, but you can configure it to suit your needs. This page will walk you through the configuration options available in Poyro.

## Configuration file

Poyro uses a configuration file to manage its settings. Poyro looks for a file named `poyro.config.js` in the root of your project. A sample configuration file might look like this:

```javascript
import defineConfig from "@poyro/vitest/config";

export default defineConfig({});
```

This configuration file is a JavaScript module that exports a configuration object. The example above changes no settings from the default configuration.

To make changes, follow the instructions below.

## Llama.cpp

Poyro uses `node-llama-cpp` under the hood to run a local LLM. You can configure the settings for `node-llama-cpp` by passing an object to the `llamaCpp` key in the configuration object. There can be additional objects within the `llamaCpp` object to configure the LLM:

- `frameworkOptions`: An object that contains options for the node-llama-cpp framework.
- `modelOptions`: An object that contains options for the LLM model being used.
- `contextOptions`: An object that contains options for the LLM context.

The default config used by Poyro is the following:

```javascript
export const defaultConfig = {
  llamaCpp: {
    frameworkOptions: {
      vramPadding: 0,
      debug: false,
    },
    modelOptions: {
      gpuLayers: 33,
    },
    contextOptions: {
      contextSize: 512,
      seed: 9,
    },
  },
};
```

### Framework options

See [here](https://github.com/withcatai/node-llama-cpp/blob/beta/src/bindings/getLlama.ts#L36-L132) for the full list of options available for the framework.

### Model options

See [here](https://github.com/withcatai/node-llama-cpp/blob/beta/src/evaluator/LlamaModel/LlamaModel.ts#L23-L148) for the full list of options available for the model.

### Context options

See [here](https://github.com/withcatai/node-llama-cpp/blob/beta/src/evaluator/LlamaContext/types.ts#L5-L91) for the full list of options available for the context.
