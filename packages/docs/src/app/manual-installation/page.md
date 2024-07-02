---
title: Manual installation
nextjs:
  metadata:
    title: Manual installation
    description: Step-by-step guide to installing the Poyro library.
---

Welcome to the manual installation guide for Poyro! This guide will walk you through the process of setting up your project manually to use the Poyro library.

{% callout type="note" title="Automatic installation" %}
The recommended way to install Poyro is to use the automated setup process. If you encounter any issues during the automated setup or want more fine-tuned control over your configuration, you can follow this guide. To use our automated setup, please refer to the [quick start guide](/#quick-start).
{% /callout %}

---

## vitest

If you haven't already, make sure to install Vitest and verify that it's working before proceeding. You can find more information about Vitest on the [Vitest website](https://vitest.dev/). Once installed, you can proceed with the manual installation of Poyro.

We recommend setting `"test": "vitest"` in your `package.json` to run your tests with Vitest.

## @poyro/vitest

`@poyro/vitest` is a package that contains Poyro bindings for the [Vitest](https://vitest.dev/) test framework. Make sure that you've already installed Vitest and verified that it's working before proceeding.

### Installation

To install the package, run the following command:

If you're using npm:

```bash
npm install --save-dev @poyro/vitest
```

If you're using yarn:

```bash
yarn add --dev @poyro/vitest
```

If you're using pnpm:

```bash
pnpm install --save-dev @poyro/vitest
```

### Configuration

Once installed, you will need to configure Vitest to use the Poyro bindings. To do this, create a `vitest.setup.js` file in the root of your project and add the following code:

```javascript
import "@poyro/vitest";
```

Once you have done this, update create or update `vitest.config.js` to include the following (if you didn't previously have a setup file):

```javascript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["vitest.setup.js"],
  },
});
```

Next, create a `vitest.d.ts` file in the root of your project and add the following code:

```typescript
import type { Assertion, AsymmetricMatchersContaining } from "vitest";
import { VitestPoyroMatchers } from "@poyro/vitest";

declare module "vitest" {
  interface Assertion<T = any> extends VitestPoyroMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestPoyroMatchers {}
}
```

Finally, update your `tsconfig.json` to include the following:

```json
{
  "compilerOptions": {
    "types": ["vitest.d.ts"]
  }
}
```

You're now all set to include Poyro matchers in your tests!
