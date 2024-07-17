import type { SyncExpectationResult } from "@vitest/expect";

import type { OutputFulfillsCriterionArgs } from "../../functions/outputFulfillsCriterion/types";

type ReplaceReturnType<T extends (...a: any) => any, TNewReturn> = (
  ...a: Parameters<T>
) => TNewReturn;

export type ToFulfillCriterion = ReplaceReturnType<
  OutputFulfillsCriterionArgs,
  Promise<SyncExpectationResult>
>;
