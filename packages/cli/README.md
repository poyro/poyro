# poyro

[![npm version](https://badge.fury.io/js/poyro.svg)](https://badge.fury.io/js/poyro) | [![docs](https://img.shields.io/badge/poyro-docs-blue)](https://docs.poyro.dev) | [![Discord](https://img.shields.io/discord/1250274948233039883?logo=discord&label=Discord)](https://discord.gg/gmCjjJ5jSf)

This package contains the CLI utility for Poyro, a tool for testing language models using a simple API and existing unit testing frameworks. If you're looking for our Vitest plugin, see the [@poyro/vitest](https://www.npmjs.com/package/@poyro/vitest) package.

See the [Poyro documentation](https://docs.poyro.dev/#usage) for more information.

## Prerequisites

- Node.js 20 or later
- Your project must have "type": "module" in its package.json (this library is ESM only)
- Recommended: CUDA-compatible GPU (Nvidia) or Metal-compatible GPU (Apple Silicon) for best performance, but not required

## Usage

To set up Poyro on your dev environment, simply run:

```bash
npx poyro init
```
