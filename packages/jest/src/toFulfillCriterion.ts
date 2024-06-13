import { sum } from "@poyro/runner";

import { getModel } from "./getModel";

export const toFulfillCriterion = (): jest.CustomMatcherResult => {
  getModel();

  sum(1, 2);

  return {
    pass: false,
    message: () => "Not implemented yet",
  };
};
