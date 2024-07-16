import type { SyncExpectationResult } from "@vitest/expect";
import { outputFulfillsCriterion } from "./outputFulfillsCriterion";

export const toFulfillCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<SyncExpectationResult> => {

  // parse the response
  const { result, feedback } = await outputFulfillsCriterion(
    llmOutput,
    criterion,
    additionalContext
  )

  return {
    pass: result,
    message: () => feedback,
    ...(!result && {
      actual: `Received: ${llmOutput}`,
      expected: `Expected: A valid response given the criterion: '${criterion}'`,
    }),
  };
};
