import { expect } from "vitest";

import * as extensions from "./matchers";

export interface VitestPoyroMatchers<R = unknown> {
  toFulfillCriterion(criterion: string, additionalContext?: string): R;
  toFulfillCriterionAgainstSome(criterion: string, statements: string[]): R;
  toFulfillCriterionAgainstEvery(criterion: string, statements: string[]): R;
}

expect.extend(extensions);
