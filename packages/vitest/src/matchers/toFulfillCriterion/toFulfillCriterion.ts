import type { SyncExpectationResult } from "@vitest/expect";
import handlebars from "handlebars";

import { makeModel } from "../../makeModel";

import template from "./template.md";
import systemPrompt from "./system.md";

const compiledTemplate = handlebars.compile(template);

export const toFulfillCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<SyncExpectationResult> => {
  const poyro = global.poyro || (await makeModel());

  // create a new grammar
  const grammar = poyro.createGrammar({
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
  const prompt = compiledTemplate({ criterion, llmOutput, additionalContext });

  // prompt the session
  const answer = await poyro.prompt(prompt, {
    grammar,
    systemPrompt: systemPrompt as string,
  });

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
