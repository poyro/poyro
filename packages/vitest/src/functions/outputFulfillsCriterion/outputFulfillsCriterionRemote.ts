import handlebars from "handlebars";
import fetch from "node-fetch";

import template from "../../templates/fulfillCriterion/template.md";
import systemPrompt from "../../templates/fulfillCriterion/system.md";
import { getConfig } from "../../utils";

import type { FeedbackObject, RunpodResponse } from "./types";

const compiledTemplate = handlebars.compile(template);

export const outputFulfillsCriterionRemote = async (
  llmOutput: string,
  criterion: string,
  additionalContext?: string
): Promise<FeedbackObject> => {
  // Get the config
  const { remote } = await getConfig();

  // generate the prompt
  const prompt = compiledTemplate({ criterion, llmOutput, additionalContext });

  // If no remote server URL is set, return false
  if (!remote?.baseUrl) {
    return {
      result: false,
      feedback:
        "Remote is enabled, but the remote server URL is not set in the environment.",
    };
  }

  // Make a request to the remote server
  const response = await fetch(`${remote.baseUrl}/v1/fulfill-criterion`, {
    method: "POST",
    body: JSON.stringify({
      prompt,
      system_prompt: systemPrompt as string,
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.POYRO_API_KEY}`,
    },
  });

  // Parse the response
  const json = (await response.json()) as RunpodResponse | { error: string };

  // Check if the response is ok
  if (!response.ok) {
    return {
      result: false,
      feedback: `Encountered an unexpected server error: ${(json as { error: string }).error}`,
    };
  }

  // Destructuring the JSON response
  const { output, status } = json as RunpodResponse;

  // Check if the response is failed
  if (status === "FAILED") {
    return {
      result: false,
      feedback: `Encountered an unexpected server error`,
    };
  }

  // parse the content
  const { choices } = output;

  // grab the first choice
  const choice = choices.shift();

  // check if there is a choice, if not, return false
  if (!choice) {
    return {
      result: false,
      feedback: `No response was returned`,
    };
  }

  // parse the choice content
  const parsed = JSON.parse(choice.message.content) as FeedbackObject;

  return {
    result: parsed.result,
    feedback: parsed.feedback,
  };
};
