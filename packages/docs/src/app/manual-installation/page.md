---
title: Manual installation
nextjs:
  metadata:
    title: Manual installation
    description: Step-by-step guide to installing the Poyro library.
---

Welcome to the manual installation guide for Poyro! This guide will walk you through the process of manually setting up your project to use the Poyro library.

Before attempting a manual installation, please try our automated installation command:

```bash
npx poyro init
```

---

## Before Starting

`@poyro/vitest` is a package that contains Poyro bindings for the [Vitest](https://vitest.dev/) test framework. Make sure that you've already installed Vitest and verified that it's working before proceeding.

## Installation

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

## Basic Configuration

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

## Test Command Setup

To have Poyro correctly run when `npm test` (or the test command for your package manager) is run this needs to be configured in `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
  }
}
```

Note that any vitest CLI flags that you want to include by default when running `npm test` can be appended to the `vitest` command. For some useful ones see the [Troubleshooting](/#troubleshooting) section.

## TypeScript Configuration

The following steps are only needed for TypeScript projects.

Create a `vitest.d.ts` file in the root of your project and add the following code:

```typescript
import type { Assertion, AsymmetricMatchersContaining } from "vitest";
import { VitestPoyroMatchers } from "@poyro/vitest";

declare module "vitest" {
  interface Assertion<T = any> extends VitestPoyroMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestPoyroMatchers {}
}
```

Update your `tsconfig.json` to include the following:

```json
{
  "compilerOptions": {
    "types": ["vitest.d.ts"]
  }
}
```

You're now all set to include Poyro matchers in your tests!
