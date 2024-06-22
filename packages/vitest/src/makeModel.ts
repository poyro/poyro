import fs from "node:fs";
import path from "node:path";

import { LlamaChatSession, getLlama } from "node-llama-cpp";
import type { Llama, LlamaContext, LlamaModel } from "node-llama-cpp";
import { stringify, parse } from "flatted";

import { version } from "../package.json";

import { getModelPath } from "./utils/getModelPath";

class Model {
  public llama: Llama;
  public model: LlamaModel;
  public context: LlamaContext | undefined;
  public session: LlamaChatSession | undefined;
  public systemPrompt: string | undefined;

  constructor(llama: Llama, model: LlamaModel, systemPrompt?: string) {
    this.systemPrompt = systemPrompt;
    this.llama = llama;
    this.model = model;

    const loaded = this._loadContext();

    if (loaded) {
      console.log("here");
      if (loaded.sequencesLeft) {
        this.context = loaded;
      } else {
        this._deleteContext();
      }
    }
  }

  private async _createContext(): Promise<LlamaContext> {
    console.log(
      this.model.trainContextSize,
      Math.min(4096, this.model.trainContextSize)
    );

    this.context = await this.model.createContext({
      contextSize: Math.min(4096, this.model.trainContextSize),
    });

    return this.context;
  }

  public saveContext(): void {
    if (!this.context) {
      throw new Error("No context to save");
    }

    // Serialize the context
    const serializedContext = stringify(this.context);

    // Get the directory path and filename for the model
    const { cacheDir } = getModelPath();
    const contextPath = path.join(cacheDir, "context", `${version}.json`);

    // Create the directory if it doesn't exist
    if (!fs.existsSync(path.dirname(contextPath))) {
      fs.mkdirSync(path.dirname(contextPath), { recursive: true });
    }

    // Save the context to a file
    fs.writeFileSync(contextPath, serializedContext);
  }

  private _getContextPath(): string {
    const { cacheDir } = getModelPath();
    return path.join(cacheDir, "context", `${version}.json`);
  }

  private _loadContext(): LlamaContext | undefined {
    // Get the directory path and filename for the model
    const contextPath = this._getContextPath();

    // Check if the context file exists
    if (fs.existsSync(contextPath)) {
      // Load the context from a file
      const serializedContext = fs.readFileSync(contextPath, "utf-8");

      return parse(serializedContext) as LlamaContext;
    }
  }

  private _deleteContext(): void {
    // Get the directory path and filename for the model
    const contextPath = this._getContextPath();

    // Check if the context file exists
    if (fs.existsSync(contextPath)) {
      // Delete the context file
      fs.unlinkSync(contextPath);
    }
  }

  public async getContext(): Promise<LlamaContext> {
    console.log(this.context?.sequencesLeft);

    // If there is already a context in memory with
    // sequences left, return it
    if (this.context?.sequencesLeft) {
      console.log("here");
      return this.context;
    }

    // Attempt to load the context
    const loaded = this._loadContext();

    // If the context was loaded successfully, return it
    if (loaded?.sequencesLeft) {
      return loaded;
    }

    // If the context could not be loaded or
    // has no sequences left, create a new context
    return this._createContext();
  }

  public async createSession(): Promise<LlamaChatSession> {
    if (!this.context?.sequencesLeft) {
      this.context = await this.getContext();
    }

    this.session = new LlamaChatSession({
      contextSequence: this.context.getSequence(),
      systemPrompt: this.systemPrompt,
      autoDisposeSequence: false,
    });

    return this.session;
  }
}

export const makeModel = async (systemPrompt?: string): Promise<Model> => {
  // Get the directory path and filename for the model
  const { dirPath, filename } = getModelPath();

  // Put together the file path
  const modelPath = path.join(dirPath, filename);

  // Create a new llama model
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath });

  return new Model(llama, model, systemPrompt);
};
