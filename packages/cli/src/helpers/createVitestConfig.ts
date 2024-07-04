import fs from "fs";
import path from "path";
import chalk from "chalk";
import { makeLogMessage } from "./makeLogMessage";


export const createVitestConfig = async (): Promise<string> => {

  // Create the vitest config file
  console.log(
    makeLogMessage(
      `No 'vitest.config.js/ts' file found. Creating ${chalk.blueBright("vitest.config.js")}...`
    )
  );

  // Get the vitest config file path
  const cwd = process.cwd();
  const vitestSetupPath = path.join(cwd, "vitest.config.js");

  // Create the vitest config file
  await fs.writeFileSync(
    vitestSetupPath,
    `import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["vitest.setup.js"],
  },
});\n`
  );

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright("vitest.config.js")} created successfully.`
    )
  );

  return vitestSetupPath;
}