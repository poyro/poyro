---
title: How does it work?
nextjs:
  metadata:
    title: How does it work?
    description: Learn how Poyro works under the hood.
---

Welcome to the architecture guide for Poyro! This guide will walk you through the internals of the Poyro library and how it works.

## How is it free?

Poyro uses a quantized version of [Llama-3](https://llama.meta.com/llama3/), an open source LLM developed at Meta. The quantized version is a smaller, more efficient version of the original LLM that is optimized for use locally.

The specific type of the quantized Llama-3 8B Instruct model we currently use is the [`Q4_K_M`](https://huggingface.co/mradermacher/Meta-Llama-3-8B-Instruct-GGUF?show_file_info=Meta-Llama-3-8B-Instruct.Q4_K_M.gguf), which aims to provide a balance between performance and size. At just under 5GB, it is small enough to be used on most consumer-grade hardware while still providing high-quality results. We recommend a device with at least 16GB of VRAM and a CUDA-compatible GPU (Nvidia) or Metal-compatible GPU (Apple Silicon) for best performance.

## How does it work?

Poyro works by providing a set of custom matchers for the [Vitest](https://vitest.dev/) test framework. These matchers allow you to evaluate the output of your application against a set of criteria, providing feedback based on the result.

Internally, Poyro initializes the quantized Llama-3 model and uses it to evaluate the output against the specified assertions. This model and its cache is reused across multiple tests as appropriate to improve performance and reduce resource usage.
