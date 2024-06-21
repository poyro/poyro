---
"@poyro/vitest": patch
"poyro": patch
---

Fix exports in package.json. Given the change of `tsconfig.json` to target `ES2022`, pointing `main` to `dist/index.mjs` is incorrect. Instead, point `main` to `dist/index.js` and `types` to `dist/index.d.ts`.
