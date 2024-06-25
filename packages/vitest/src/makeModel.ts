import path from "node:path";

import type {
  GbnfJsonSchema,
  LLamaChatPromptOptions,
  Llama,
  LlamaContextSequence,
  LlamaModel,
} from "node-llama-cpp";
import {
  LlamaChatSession,
  getLlama,
  LlamaJsonSchemaGrammar,
} from "node-llama-cpp";

import { getModelPath } from "./utils/getModelPath";

export interface SessionOptions {
  /** The system prompt to use */
  systemPrompt?: string;
}

export class PoyroModelCore {
  private llama: Llama;
  private model: LlamaModel;
  private contextSequence: LlamaContextSequence | undefined;

  constructor(llama: Llama, model: LlamaModel) {
    this.llama = llama;
    this.model = model;
  }

  private async _getContextSequence(): Promise<LlamaContextSequence> {
    // If there is already a context sequence in memory, return it
    if (this.contextSequence) {
      return this.contextSequence;
    }

    // Otherwise, create a new context
    const context = await this.model.createContext();

    // Then get the sequence
    this.contextSequence = context.getSequence();

    return this.contextSequence;
  }

  private async _createSession({
    systemPrompt,
  }: SessionOptions): Promise<LlamaChatSession> {
    const contextSequence = await this._getContextSequence();

    return new LlamaChatSession({
      contextSequence,
      systemPrompt,
      autoDisposeSequence: false,
    });
  }

  public createGrammar<const T extends Readonly<GbnfJsonSchema>>(
    grammar: T
  ): LlamaJsonSchemaGrammar<T> {
    return new LlamaJsonSchemaGrammar(this.llama, grammar);
  }

  public async prompt(
    prompt: string,
    { systemPrompt, ...options }: LLamaChatPromptOptions & SessionOptions = {}
  ): Promise<string> {
    // Create a new session
    const session = await this._createSession({
      systemPrompt,
    });

    // prompt the session
    const answer = await session.prompt(prompt, options);

    return answer;
  }
}

export const makeModel = async (): Promise<PoyroModelCore> => {
  // Get the directory path and filename for the model
  const { dirPath, filename } = getModelPath();

  // Put together the file path
  const modelPath = path.join(dirPath, filename);

  // Create a new llama model
  const llama = await getLlama();
  const model = await llama.loadModel({ modelPath });

  return new PoyroModelCore(llama, model);
};
