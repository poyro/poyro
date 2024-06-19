import type { Assertion, AsymmetricMatchersContaining } from "vitest";
import type { VitestPoyroMatchers } from "@poyro/vitest";

declare module "vitest" {
  type Assertion<T = any> = VitestPoyroMatchers<T>
  interface AsymmetricMatchersContaining extends VitestPoyroMatchers {}
}
