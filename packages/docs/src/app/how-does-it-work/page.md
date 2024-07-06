---
title: How does it work?
nextjs:
  metadata:
    title: How does it work?
    description: Learn how Poyro works under the hood.
---

Welcome to the architecture guide for Poyro! This guide will walk you through the internals of the Poyro library and how it works.

## How is it free?

Poyro uses a quantized version of [Phi 3.1 Mini 4k Instruct](https://huggingface.co/microsoft/Phi-3-mini-4k-instruct), an open source LLM developed at Microsoft. The quantized version is a smaller, more efficient version of the original LLM that is optimized for use locally.

The specific type of the quantized Phi 3.1 Mini 4k Instruct model we currently use is the [`Q4_K_M`](https://huggingface.co/bartowski/Phi-3.1-mini-4k-instruct-GGUF), which aims to provide a balance between performance and size. At just under 2.4GB, it is small enough to be used on most consumer-grade hardware while still providing high-quality results. We recommend a device with at least 8GB of VRAM and a CUDA-compatible GPU (Nvidia) or Metal-compatible GPU (Apple Silicon) for best performance.

## How does it work?

Poyro works by providing a set of custom matchers for the [Vitest](https://vitest.dev/) test framework. These matchers allow you to evaluate the output of your application against a set of criteria, providing feedback based on the result.

Internally, Poyro initializes the quantized Llama-3 model and uses it to evaluate the output against the specified assertions. This model and its cache is reused across multiple tests as appropriate to improve performance and reduce resource usage.
