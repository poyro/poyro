import { expect } from "vitest";

import * as extensions from "./matchers";
import { downloadModel } from "./downloadModel";

export interface VitestPoyroMatchers<R = unknown> {
  toFulfillCriterion: (
    criterion: string,
    additionalContext?: string
  ) => Promise<R>;
}

expect.extend(extensions);

// Download the model
await downloadModel();
