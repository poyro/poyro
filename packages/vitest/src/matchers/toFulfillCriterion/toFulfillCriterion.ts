import type { SyncExpectationResult } from "@vitest/expect";
import { compile } from "handlebars";
import { LlamaJsonSchemaGrammar } from "node-llama-cpp";
import { getModel } from "../../getModel";
import template from "./template.md";

const compiledTemplate = compile(template);

export const toFulfillCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<SyncExpectationResult> => {
  // get the model
  const [llama, model] = await getModel();

  // create a new grammar
  const grammar = new LlamaJsonSchemaGrammar(llama, {
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

  // generate the prompt
  const prompt = compiledTemplate({ llmOutput, criterion, additionalContext });

  // prompt the session
  const a1 = await model.prompt(prompt, { grammar: grammar });

  // parse the response
  const { result, feedback } = grammar.parse(a1);

  return {
    pass: result,
    message: () => feedback,
    ...(!result && {
      actual: llmOutput,
      expected: `A valid response given the criterion: '${criterion}'`,
    }),
  };
};
