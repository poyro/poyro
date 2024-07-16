import handlebars from "handlebars";

import { makeModel } from "../../makeModel";

import template from "./template.md";
import systemPrompt from "./system.md";
import { getGrammar } from "./grammar";

const compiledTemplate = handlebars.compile(template);

interface FeedbackObject {
  [key: string]: boolean | string;
  feedback: string;
  result: boolean;
}

export const outputFulfillsCriterion = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<FeedbackObject> => {
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
  const feedbackObject: FeedbackObject =  grammar.parse(answer);
  return feedbackObject;
}