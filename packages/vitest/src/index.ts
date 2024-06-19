import { expect } from "vitest";

import * as extensions from "./matchers";

export interface VitestPoyroMatchers<R = unknown> {
  toFulfillCriterion: (
    criterion: string,
    additionalContext?: string
  ) => Promise<R>;
}

expect.extend(extensions);
