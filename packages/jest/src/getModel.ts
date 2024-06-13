import path from "path";

// import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";
import { prompt } from "@poyro/runner";

import constants from "../constants.json";

export const getModel = () => {
  // Get to the root directory of package
  const rootDir = path.join(__dirname, "..");

  // Get to the bin directory of package
  const binDir = path.join(rootDir, "bin");

  // Get to the model file
  const modelPath = path.join(binDir, constants.model.filename);

  // // Create a new model
  const res = prompt();

  console.log(res);

  // const model = new LlamaModel({ modelPath });

  // // Create a new context
  // const context = new LlamaContext({ model });

  // // Create a new chat session and return it
  // return new LlamaChatSession({ context });
};
