import path from "node:path";
import { Llama, LlamaModel, LlamaContextSequence, LlamaJsonSchemaGrammar} from "node-llama-cpp";


class Singleton {
    private static instance: Singleton | null = null;
    private _contextSequence: LlamaContextSequence | null = null;
  
    private constructor() {
    }

    public async getContextSequence(model: LlamaModel): Promise<LlamaContextSequence> {
        if (!this._contextSequence) {
            const context = await model.createContext({
                contextSize: Math.min(4096, model.trainContextSize),
            });
            this._contextSequence = context.getSequence();
        }
        
        return this._contextSequence;
    }

    public static getInstance(): Singleton {
      if (!Singleton.instance) {
        Singleton.instance = new Singleton();
      }
      return Singleton.instance;
    }
  }

export const singletonInstance = Singleton.getInstance();