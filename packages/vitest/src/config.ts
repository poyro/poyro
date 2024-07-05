import type { 
  LlamaContextOptions, 
  LlamaModelOptions, 
  LlamaOptions
} from "node-llama-cpp";

interface llamaCppConfig {
    frameworkOptions?: LlamaOptions,
    modelOptions?: LlamaModelOptions,
    contextOptions?: LlamaContextOptions,
}

function defineConfig(config: llamaCppConfig): llamaCppConfig {
    return config;
}

export default defineConfig;