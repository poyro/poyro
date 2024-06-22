import type { SyncExpectationResult } from "@vitest/expect";
import handlebars from "handlebars";
import { LlamaJsonSchemaGrammar } from "node-llama-cpp";

import { getModel } from "../../getModel";

import template from "./template.md";

const compiledTemplate = handlebars.compile(template);

export const toFulfillCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<SyncExpectationResult> => {
  // // get the model
  // const [llama, model] = await getModel();

  const poyro = global.poyro;

  if (!poyro) {
    throw new Error("Model not loaded");
  }

  const session = await poyro.createSession();

  // create a new grammar
  const grammar = new LlamaJsonSchemaGrammar(poyro.llama, {
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
  const answer = await session.prompt(prompt, { grammar });

  poyro.saveContext();

  session.dispose();

  // parse the response
  const { result, feedback } = grammar.parse(answer);

  return {
    pass: result,
    message: () => feedback,
    ...(!result && {
      actual: llmOutput,
      expected: `A valid response given the criterion: '${criterion}'`,
    }),
  };
};
