import type {
  LlamaContextOptions,
  LlamaModelOptions,
  LlamaOptions,
} from "node-llama-cpp";

export interface LlamaCppConfig {
  /** Options for the Node Llama.cpp framework */
  frameworkOptions?: Partial<LlamaOptions>;
  /** Options for the Llama model being used */
  modelOptions?: Partial<LlamaModelOptions>;
  /** Options for the Llama context being used */
  contextOptions?: Partial<LlamaContextOptions>;
}

export interface RemoteConfig {
  /** Indicates whether the remote is enabled */
  enabled: boolean;
}

export interface PoyroVitestConfig {
  /** Configuration for Llama.cpp */
  llamaCpp?: Partial<LlamaCppConfig>;
  /** Configuration for the remote */
  remote?: Partial<RemoteConfig>;
}

export const defaultConfig: PoyroVitestConfig = {
  llamaCpp: {
    frameworkOptions: {
      vramPadding: 0,
      debug: false,
    },
    modelOptions: {
      gpuLayers: 33,
    },
    contextOptions: {
      contextSize: 512,
      seed: 9,
    },
  },
};

const defineConfig = (config: PoyroVitestConfig): PoyroVitestConfig => {
  return config;
};

export default defineConfig;
