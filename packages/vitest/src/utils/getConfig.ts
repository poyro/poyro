import fs from "node:fs";
import path from "node:path";

import { assign } from "radash";

import type { PoyroVitestConfig } from "../config";
import { defaultConfig } from "../config";

import { validateConfig } from "./validateConfig";

export const getConfig = async (): Promise<PoyroVitestConfig> => {
  // Get current working dir
  const cwd = process.cwd();

  // Get the config file path
  const configPath = path.join(cwd, "poyro.config.js");

  console.log({ configPath });

  // If the file does not exist, return the default config
  if (!fs.existsSync(configPath)) {
    return validateConfig(defaultConfig);
  }

  console.log("made it here!");

  // Otherwise, require the config file
  const config = (await import(configPath)) as PoyroVitestConfig;

  // If the config is not an object, throw an error
  if (typeof config !== "object") {
    throw new Error("The config must be an object.");
  }

  // If the config file is not valid, throw an error
  if (!config) {
    throw new Error("Something went wrong while loading the config file.");
  }

  // Return the merged config
  return validateConfig(assign(defaultConfig, config));
};
