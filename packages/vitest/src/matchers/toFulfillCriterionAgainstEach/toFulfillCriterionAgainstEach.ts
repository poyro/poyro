import { SyncExpectationResult } from "@vitest/expect";
import { compile } from "handlebars";
import { LlamaJsonSchemaGrammar } from "node-llama-cpp";

import { getModel } from "../../getModel";

import template from "./template.md";

export type AggregationMode = 'some' | 'every'

const compiledTemplate = compile(template);

export const toFulfillCriterionAgainstEach = async (
  llmOutput: string,
  criterion: string,
  statements: string[],
  aggregationMode: AggregationMode
): Promise<SyncExpectationResult> => {
  if (statements.length === 0) {
    throw new Error("The array is empty.");
}

  // get the model
  const model = getModel();

  // create a new grammar
  const grammar = new LlamaJsonSchemaGrammar({
    type: "array",
    items: {
      type: "object",
      properties: {
        feedback: {
          type: "string",
        },
        result: {
          type: "boolean",
        },
      }
    },
  } as const);

  // generate the prompt
  const statementList: string = statements.map((s, index) => `${index}. ${s}`).join('\n');
  const prompt = compiledTemplate({ statementList, llmOutput, criterion });

  // prompt the model
  const a1 = await model.prompt(prompt, { grammar });

  // parse the response
  const output = grammar.parse(a1);
  const results = output.map(item => item.result)

  let result;
  if(aggregationMode == "some") {
    result = results.some(value => value);
  } else {
    result = results.every(value => value);
  }

  const failedIndices = results.map((value, index) => value ? index : null).filter(index => index != null);
  const failureMessages = failedIndices.map(index => `- "${statements[index]}": ${output[index].feedback}`).join('\n');
  const errorMessage = `The passed value did not pass the criterion for some statements:\n\n${failureMessages}`

  return {
    pass: result,
    message: () => errorMessage,
    ...(!result && {
      actual: llmOutput,
      expected: `A response passing the criteria "${criterion}" for ${aggregationMode} of the statements.`,
    }),
  };
};

export const toFulfillCriterionAgainstSome = async (
  llmOutput: string,
  criterion: string,
  statements: string[],
): Promise<SyncExpectationResult> => {
  return toFulfillCriterionAgainstEach(
    llmOutput,
    criterion,
    statements,
    "some",
  )
};

export const toFulfillCriterionAgainstEvery = async (
  llmOutput: string,
  criterion: string,
  statements: string[],
): Promise<SyncExpectationResult> => {
  return toFulfillCriterionAgainstEach(
    llmOutput,
    criterion,
    statements,
    "every",
  )
};
