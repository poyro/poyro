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

  // Create a new model
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath });

  // Create a new context
  const context = await model.createContext({
    contextSize: Math.min(4096, model.trainContextSize),
  });
  const contextSequence = context.getSequence();

  // Create a new chat session and return it
  const session = new LlamaChatSession({
    contextSequence,
    systemPrompt,
  });

  return [llama, session];
};
