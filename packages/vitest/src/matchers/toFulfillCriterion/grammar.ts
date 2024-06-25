import type { PoyroModelCore } from "../../makeModel";

export const getGrammar = (poyro: PoyroModelCore) => {
  return poyro.createGrammar({
    type: "object",
    properties: {
      feedback: {
        type: "string",
      },
      result: {
        type: "boolean",
      },
    },
  } as const);
};
