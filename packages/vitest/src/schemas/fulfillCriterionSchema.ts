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
  required: ["feedback", "result"],
} as const;
