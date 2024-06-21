---
"@poyro/vitest": patch
"poyro": patch
---

Improve testing by co-locating tests within the `@poyro/vitest` package rather than relying on a demo app. This will allow us to test the package in isolation and ensure that it works as expected.

To continue to test a "real-world" example, we will dogfood using our `nextjs-vitest-poyro-demo` repo. This will allow us to ensure that the package also works as expected in a real-world scenario.
