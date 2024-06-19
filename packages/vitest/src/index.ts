import { expect } from "vitest";
import * as extensions from "./matchers";

export interface VitestPoyroMatchers<R = unknown> {
  toFulfillCriterion: (
    criterion: string, 
    additionalContext?: string
  ) => Promise<R>;
  toFulfillCriterionAgainstSome: (
    criterion: string, 
    statements: string[]
  ) => Promise<R>;
  toFulfillCriterionAgainstEvery: (
    criterion: string, 
    statements: string[]
  ) => Promise<R>;
}

expect.extend(extensions);
