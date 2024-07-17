export const fulfillCriterionSchema = {
  type: "object",
  properties: {
    feedback: {
      type: "string",
    },
    result: {
      type: "boolean",
    },
  },
} as const;
