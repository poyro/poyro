import path from "node:path";

import findCacheDirectory from "find-cache-dir";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

import constants from "../../constants.json" with { type: "json" };

const cacheDir = findCacheDirectory({ name: "@poyro/vitest" });

// Throw an error if the cache directory could not be identified
if (!cacheDir) {
  throw new Error(makeLogMessage(`Could not identify cache directory`));
}

// Put together the directory path for the models
const dirPath = path.join(cacheDir, "models");

// Put together the file path
const modelPath = path.join(dirPath, constants.model.filename);

const llama = await getLlama();
const model = await llama.loadModel({
  modelPath,
});
const context = await model.createContext({
  contextSize: Math.min(4096, model.trainContextSize),
  sequences: 2,
});

const systemPrompt = `You are a fair judge assistant tasked with providing clear, objective feedback based on a specific criterion, ensuring each assessment reflects the absolute standards set for performance.

You will be given a response to evaluate, a binary criterion to evaluate against, and an optional instruction (might include an Input inside it). You must provide feedback based on the given criterion and the response.

Please follow these guidelines:

1. Write a detailed feedback that assess the quality of the response strictly based on the given score rubric, not evaluating in general.
2. After writing feedback, write a determination True or False about whether the response meets the binary criteria specified.
3. Do not generate any other opening, closing, and explanations.
4. Keep your feedback concise and clear, do not repeat yourself and do not exceed 280 characters for the feedback.
5. Only describe the boolean result as True/False, do not use any other words to describe the result.

### Response to evaluate:

I am not a recipe.`;

const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
  autoDisposeSequence: false,
  systemPrompt,
});

const q1 = `### Score Rubrics:

[Is this a recipe?]:

- False: The response being evaluated does not meet the criterion described in the square brackets.
- True: The response being evaluated does meet the criterion described in the square brackets.

### Feedback:`;
// console.log(`User: ${q1}`);

console.time();
const a1 = await session.prompt(q1);
console.timeEnd();
// console.log(`AI: ${a1}`);

// session.dispose();

const session2 = new LlamaChatSession({
  contextSequence: context.getSequence(),
});

const q1a = `${q1}\n(Return feedback as JSON)`;
// console.log(`User: ${q1a}`);

console.time();
const a1a = await session2.prompt(q1);
console.timeEnd();
// console.log(`AI: ${a1a}`);
