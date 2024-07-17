import handlebars from "handlebars";

import { makeModel } from "../../makeModel";
import { fulfillCriterionSchema } from "../../schemas/fulfillCriterionSchema";
import template from "../../templates/fulfillCriterion/template.md";
import systemPrompt from "../../templates/fulfillCriterion/system.md";

import type { FeedbackObject } from "./types";

const compiledTemplate = handlebars.compile(template);

export const outputFulfillsCriterionLocal = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<FeedbackObject> => {
  const poyro = global.poyro || (await makeModel());

  // generate the prompt
  const prompt = compiledTemplate({ criterion, llmOutput, additionalContext });

  // create a new grammar
  const grammar = poyro.createGrammar(fulfillCriterionSchema);

  // prompt the session
  const answer = await poyro.prompt(prompt, {
    grammar,
    systemPrompt: systemPrompt as string,
  });

  // parse the response
  return grammar.parse(answer);
};
