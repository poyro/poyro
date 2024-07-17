import { checkIfRemote } from "../../utils";

import type { OutputFulfillsCriterionArgs } from "./types";
import { outputFulfillsCriterionRemote } from "./outputFulfillsCriterionRemote";
import { outputFulfillsCriterionLocal } from "./outputFulfillsCriterionLocal";

/**
 *
 * @param llmOutput - The output from the LLM to test
 * @param criterion - The criterion to test against
 * @param additionalContext - Additional context to include in the prompt
 * @returns Object containing feedback and result of the comparison
 *
 * @example
 * const resp = await outputFulfillsCriterion(llmOutput, criterion, additionalContext);
 */
export const outputFulfillsCriterion: OutputFulfillsCriterionArgs = async (
  ...args
) => {
  const runOnRemote = await checkIfRemote();

  if (runOnRemote) {
    return outputFulfillsCriterionRemote(...args);
  }

  return outputFulfillsCriterionLocal(...args);
};
