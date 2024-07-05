import { LlamaLogLevel } from "node-llama-cpp";
import type { Schema } from "yup";
import { array, boolean, lazy, mixed, number, object, string } from "yup";

import type { PoyroVitestConfig } from "../config";

type Shape<DType extends object, Strict = true> = {
  [Key in keyof (Strict extends true
    ? DType
    : Partial<DType>)]: DType[Key] extends any[]
    ? Schema<DType[Key]>
    : DType[Key] extends object
      ? Strict extends true
        ? Schema<DType[Key]>
        : Schema<Partial<DType[Key]>>
      : Schema<DType[Key]>;
};

const _configSchema = object().shape<Shape<PoyroVitestConfig>>({
  llamaCpp: object()
    .shape({
      frameworkOptions: object({
        gpu: lazy((value) => {
          return typeof value === "boolean"
            ? boolean<false>().oneOf([false]).defined()
            : string().oneOf(["auto", "metal", "cuda", "vulkan"]).defined();
        }).optional(),
        logLevel: mixed<LlamaLogLevel>()
          .oneOf(Object.values(LlamaLogLevel))
          .optional(),
        logger: lazy((value) => {
          return typeof value === "function"
            ? (mixed().nonNullable().optional() as any)
            : string().defined().nullable().optional();
        }).optional(),
        build: string().oneOf(["auto", "never", "forceRebuild"]).optional(),
        cmakeOptions: object().shape({}).optional(),
        existingPrebuiltBinaryMustMatchBuildOptions: boolean().optional(),
        usePrebuiltBinaries: boolean().optional(),
        progressLogs: boolean().optional(),
        skipDownload: boolean().optional(),
        vramPadding: lazy((value) => {
          return typeof value === "function"
            ? (mixed().nonNullable().optional() as any)
            : number().defined().optional();
        }).optional(),
        debug: boolean().optional(),
      }).optional(),
      modelOptions: object()
        .shape({
          modelPath: string().defined().optional(),
          gpuLayers: lazy((value) => {
            if (typeof value === "string") {
              return string<"auto" | "max">()
                .defined()
                .oneOf(["auto", "max"])
                .optional();
            }

            if (typeof value === "number") {
              return number().defined().optional();
            }

            return object().shape({
              min: number().defined().optional(),
              max: number().defined().optional(),
              fitContext: object()
                .shape({
                  contextSize: number().defined().optional(),
                  embeddingContext: boolean().defined().optional(),
                })
                .optional(),
            });
          }).optional(),
          vocabOnly: boolean().optional(),
          useMmap: boolean().optional(),
          useMlock: boolean().optional(),
          checkTensors: boolean().optional(),
          lora: lazy((value) => {
            return typeof value === "string"
              ? string().defined().optional()
              : object().shape({
                  adapters: array()
                    .of(
                      object().shape({
                        loraFilePath: string().required(),
                        baseModelPath: string().optional(),
                        scale: number().optional(),
                      })
                    )
                    .required(),
                  threads: number().optional(),
                  onLoadProgress: lazy((value) => {
                    if (typeof value === "function") {
                      return mixed().nonNullable() as any;
                    }

                    throw new Error("onLoadProgress must be a function");
                  }).optional(),
                });
          }).optional(),
          ignoreMemorySafetyChecks: boolean().optional(),
        })
        .optional(),
      contextOptions: object()
        .shape({
          sequences: number().optional(),
          seed: number().nullable(),
          contextSize: lazy((value) => {
            if (typeof value === "string") {
              return string<"auto">().defined().oneOf(["auto"]);
            }

            if (typeof value === "number") {
              return number().defined();
            }

            return object().shape({
              min: number().defined().optional(),
              max: number().defined().optional(),
            });
          }).optional(),
        })
        .optional(),
      batchSize: number().optional(),
      threads: number().optional(),
      batching: object().shape({
        dispatchSchedule: lazy((value) => {
          return typeof value === "function"
            ? (mixed().nonNullable().optional() as any)
            : string().oneOf(["nextTick"]).defined().optional();
        }).optional(),
        itemPrioritizationStrategy: lazy((value) => {
          return typeof value === "function"
            ? (mixed().nonNullable().optional() as any)
            : string()
                .oneOf(["maximumParallelism", "firstInFirstOut"])
                .defined()
                .optional();
        }).optional(),
      }),
      createSignal: lazy((value) => {
        if (typeof value === "function" || value === undefined) {
          return mixed().optional();
        }

        throw new Error("createSignal must be a function");
      }).optional(),
      ignoreMemorySafetyChecks: boolean().optional(),
    })
    .optional(),
});

export const validateConfig = <C extends PoyroVitestConfig>(
  config: C
): PoyroVitestConfig => {
  const configSchema = _configSchema as Schema<PoyroVitestConfig>;

  return configSchema.validateSync(config, { strict: true });
};
