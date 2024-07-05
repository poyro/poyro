import { makeLogMessage } from "./makeLogMessage";
import fg from "fast-glob";


export const getVitestConfigIfExists = async (): Promise<string | null> => {
  // Get the current working directory
  const cwd = process.cwd();

  // Get the vitest config file
  const files: string[] = await fg.glob(["**/vitest.config.*"], {
    ignore: ["**/node_modules/**"],
    cwd,
  });

  // Check if multiple vitest config files exist
  if (files.length > 1) {
    throw new Error(
      makeLogMessage(
        `Multiple 'vitest.config.js/ts' files found. Please keep only one and try this command again.`
      )
    );
  } else if (files.length === 1) {
    return files[0];
  } else {
    return null;
  }
}