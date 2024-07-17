import { expect } from "vitest";

import * as extensions from "./matchers";
import { downloadModel } from "./downloadModel";
import { makeModel } from "./makeModel";

declare global {
  // eslint-disable-next-line no-var -- We need to declare a global variable
  var poyro: Awaited<ReturnType<typeof makeModel>> | undefined;
}

export interface VitestPoyroMatchers<R = unknown> {
  /**
   * This matcher checks if the output fulfills a given criterion.
   *
   * @param criterion - The criterion to fulfill
   * @param additionalContext - Additional context to provide to the model
   *
   * @example
   * await expect("output").toFulfillCriterion("criterion");
   */
  toFulfillCriterion: (
    criterion: string,
    additionalContext?: string
  ) => Promise<R>;
}

expect.extend(extensions);

// Download the model
await downloadModel();

const poyro = await makeModel();

if (!global.poyro) {
  global.poyro = poyro;
}
