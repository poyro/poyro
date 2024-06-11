import { getModel } from "./getModel";

export const toFulfillCriterion = (): jest.CustomMatcherResult => {
  getModel();

  return {
    pass: false,
    message: () => "Not implemented yet",
  };
};
