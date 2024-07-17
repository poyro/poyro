import type { SyncExpectationResult } from "@vitest/expect";
import handlebars from "handlebars";
import fetch from "node-fetch";

import { fulfillCriterionSchema } from "../../schemas/fulfillCriterionSchema";
import template from "../../templates/fulfillCriterion/template.md";
import systemPrompt from "../../templates/fulfillCriterion/system.md";

import type { ToFulfillCriterion } from "./types";

const compiledTemplate = handlebars.compile(template);

interface RunpodResponse {
  delayTime: number;
  executionTime: number;
  id: string;
  output: {
    choices: {
      finish_reason: string;
      index: number;
      logprobs: null;
      message: {
        content: string;
        role: string;
      };
    }[];
    created: number;
    id: string;
    model: string;
    usage: {
      completion_tokens: number;
      prompt_tokens: number;
      total_tokens: number;
    };
  };
  status:
    | "COMPLETED"
    | "IN_PROGRESS"
    | "IN_QUEUE"
    | "FAILED"
    | "CANCELLED"
    | "TIMED_OUT";
}

export const toFulfillCriterionRemote: ToFulfillCriterion = async (
  llmOutput,
  criterion,
  additionalContext
): Promise<SyncExpectationResult> => {
  // generate the prompt
  const prompt = compiledTemplate({ criterion, llmOutput, additionalContext });

  // Make a request to the remote server
  // const response = await fetch("https://api.poyro.dev/v1/fulfill-criterion", {
  const response = await fetch("http://localhost:3000/v1/fulfill-criterion", {
    method: "POST",
    body: JSON.stringify({
      prompt,
      system_prompt: systemPrompt as string,
      json_schema: fulfillCriterionSchema,
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
      pass: false,
      message: () =>
        `Encountered an unexpected server error: ${(json as { error: string }).error}`,
    };
  }

  // Destructuring the JSON response
  const { output, status } = json as RunpodResponse;

  // Check if the response is failed
  if (status === "FAILED") {
    return {
      pass: false,
      message: () => `Encountered an unexpected server error`,
    };
  }

  // parse the content
  const { choices } = output;

  // grab the first choice
  const choice = choices.shift();

  // check if there is a choice, if not, return false
  if (!choice) {
    return {
      pass: false,
      message: () => `No response was returned`,
    };
  }

  // parse the choice content
  const parsed = JSON.parse(choice.message.content);

  // check if the feedback is true
  const result = parsed.feedback.toLowerCase().includes("true");

  return {
    pass: result,
    message: () => parsed.feedback,
    ...(!result && {
      actual: `Received: ${llmOutput}`,
      expected: `Expected: A valid response given the criterion: '${criterion}'`,
    }),
  };
};
