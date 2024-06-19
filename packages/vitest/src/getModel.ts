import { fileURLToPath } from "node:url";
import path from "node:path";
import {getLlama, LlamaChatSession, Llama} from "node-llama-cpp";
import constants from "../constants.json";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getModel = async (systemPrompt?: string): Promise<[Llama, LlamaChatSession]> => {
  // Get to the root directory of package
  const rootDir = path.join(__dirname, "..");

  // Get to the bin directory of package
  const binDir = path.join(rootDir, "bin");

  // Get to the model file
  const modelPath = path.join(binDir, constants.model.filename);

  // Create a new model
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath: modelPath });

  // Create a new context
  const context = await model.createContext({
    contextSize: Math.min(4096, model.trainContextSize)
  });
  const contextSequence = context.getSequence();

  // Create a new chat session and return it
  const session = new LlamaChatSession({
    contextSequence,
    systemPrompt: systemPrompt
  });

  return [llama, session];

};
