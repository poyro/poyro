import type { Assertion, AsymmetricMatchersContaining } from "vitest";
import { VitestPoyroMatchers } from "@poyro/vitest";

declare module "vitest" {
  interface Assertion<T = any> extends VitestPoyroMatchers<T> {}
  interface AsymmetricMatchersContaining extends VitestPoyroMatchers {}
}
