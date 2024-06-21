---
"@poyro/vitest": patch
"poyro": patch
---

Remove installing the evaluation model as part of the `postinstall` script to improve performance and DX. Now, the evaluation model is installed on the first run of `vitest` following the configuration of the package.
