import { fileURLToPath } from "node:url";
import path from "node:path";
import { LlamaContext, LlamaChatSession, LlamaModel } from "node-llama-cpp";
import constants from "../constants.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getModel = (systemPrompt?: string) => {
  // Get to the root directory of package
  const rootDir = path.join(__dirname, "..");

  // Get to the bin directory of package
  const binDir = path.join(rootDir, "bin");

  // Get to the model file
  const modelPath = path.join(binDir, constants.model.filename);

  // Create a new model
  const model = new LlamaModel({ modelPath });

  // Create a new context
  const context = new LlamaContext({ model });

  // Create a new chat session and return it
  return new LlamaChatSession({ context, systemPrompt });
};
