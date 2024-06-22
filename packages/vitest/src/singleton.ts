import path from "node:path";
import { getLlama, Llama, LlamaModel, LlamaContextSequence} from "node-llama-cpp";

import { getModelPath } from "./utils/getModelPath";

class Singleton {
    private static instance: Singleton | null = null;
    private _llama: Llama | null = null;
    private _model:  LlamaModel | null = null;
  
    private constructor() {
    }

    public async getLlama(): Promise<Llama> {
        if (!this._llama ) {
            this._llama = await getLlama();
        }
        
        return this._llama;
    }

    public async getModel(): Promise<LlamaModel> {
        if (this._model ) {
            return this._model;
        }

        if (!this._llama) {
            this._llama = await this.getLlama();
        }

        const { dirPath, filename } = getModelPath();
        const modelPath = path.join(dirPath, filename);
        this._model = await this._llama.loadModel({ modelPath });
        return this._model;
    }

    public async createContextSequence(): Promise<LlamaContextSequence> {
        if (!this._model) {
            this._model = await this.getModel();
        }

        const context = await this._model.createContext({
            contextSize: Math.min(4096, this._model.trainContextSize),
          });
        const contextSequence = context.getSequence();
        return contextSequence;
    }
  
    public static getInstance(): Singleton {
      if (!Singleton.instance) {
        Singleton.instance = new Singleton();
      }
      return Singleton.instance;
    }
  }

export const singletonInstance = Singleton.getInstance();
