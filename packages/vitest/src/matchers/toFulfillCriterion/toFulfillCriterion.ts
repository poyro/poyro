import type { SyncExpectationResult } from "@vitest/expect";
import handlebars from "handlebars";

import { makeModel } from "../../makeModel";

import template from "./template.md";
import systemPrompt from "./system.md";
import { getGrammar } from "./grammar";

const compiledTemplate = handlebars.compile(template);

export const toFulfillCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<SyncExpectationResult> => {
  const poyro = global.poyro || (await makeModel());

  // create a new grammar
  const grammar = getGrammar(poyro);

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
      actual: `Received: ${llmOutput}`,
      expected: `Expected: A valid response given the criterion: '${criterion}'`,
    }),
  };
};
