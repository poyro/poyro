import path from "node:path";

import type { Llama } from "node-llama-cpp";
import { getLlama, LlamaChatSession } from "node-llama-cpp";

import { getModelPath } from "./utils/getModelPath";

export const getModel = async (
  systemPrompt?: string
): Promise<[Llama, LlamaChatSession]> => {
  // Get the directory path and filename for the model
  const { dirPath, filename } = getModelPath();

  // Put together the file path
  const modelPath = path.join(dirPath, filename);

  const start = performance.now();

  // Create a new model
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath });

  const modelLoadTime = performance.now();
  console.log(`Model loaded in ${modelLoadTime - start}ms`);

  // Create a new context
  const context = await model.createContext({
    contextSize: Math.min(4096, model.trainContextSize),
  });
  const contextSequence = context.getSequence();

  const contextCreationTime = performance.now();
  console.log(`Context created in ${contextCreationTime - modelLoadTime}ms`);

  // Create a new chat session and return it
  const session = new LlamaChatSession({
    contextSequence,
    systemPrompt,
  });

  const sessionCreationTime = performance.now();
  console.log(
    `Session created in ${sessionCreationTime - contextCreationTime}ms`
  );

  return [llama, session];
};
