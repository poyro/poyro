import { outputFulfillsCriterion } from "../../functions";

import type { ToFulfillCriterion } from "./types";

export const toFulfillCriterionLocal: ToFulfillCriterion = async (
  llmOutput,
  criterion,
  additionalContext
) => {
  // parse the response
  const { result, feedback } = await outputFulfillsCriterion(
    llmOutput,
    criterion,
    additionalContext
  );

  return {
    pass: result,
    message: () => feedback,
    ...(!result && {
      actual: `Received: ${llmOutput}`,
      expected: `Expected: A valid response given the criterion: '${criterion}'`,
    }),
  };
};
