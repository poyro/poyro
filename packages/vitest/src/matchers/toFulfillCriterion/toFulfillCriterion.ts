import type { SyncExpectationResult } from "@vitest/expect";
import handlebars from "handlebars";
import { LlamaJsonSchemaGrammar , LlamaChatSession } from "node-llama-cpp";

import template from "./template.md";
import { singletonInstance as matcherSingletonInstance } from "./singleton";
import { singletonInstance as frameworkSingletonInstance } from "../../singleton";

const compiledTemplate = handlebars.compile(template);

export const toFulfillCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<SyncExpectationResult> => {
  // get the model and llama
  const llama = await frameworkSingletonInstance.getLlama();
  const model = await frameworkSingletonInstance.getModel();

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

  // Create a new context
  const contextSequence = await matcherSingletonInstance.getContextSequence(model);

  // Create a new chat session and return it
  const session = new LlamaChatSession({
    contextSequence,
    autoDisposeSequence: false
  });

  // generate the prompt
  const prompt = compiledTemplate({ llmOutput, criterion, additionalContext });

  // prompt the session
  const answer = await session.prompt(prompt, { grammar });

  // parse the response
  const { result, feedback } = grammar.parse(answer);

  // dispose session
  session.dispose();

  return {
    pass: result,
    message: () => feedback,
    ...(!result && {
      actual: llmOutput,
      expected: `A valid response given the criterion: '${criterion}'`,
    }),
  };
};
