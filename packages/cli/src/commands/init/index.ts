import type { Argv } from "yargs";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";

import {
  getDependencyVersion,
  installWithRunner,
  isModuleType,
  makeVitestConfig,
  makeLogMessage,
  makeVitestSetup,
  updateVitestTypes,
  updateTsconfig,
  updatePackage,
} from "../../helpers";

export const command = "init";

export const desc = "Initialize Poyro";

export const builder = (yargs: Argv): Argv => {
  return yargs;
};

export const handler = async (): Promise<void> => {
  // Welcome user to poyro
  console.log(makeLogMessage("Welcome to Poyro! 🕵️"));

  if (!isModuleType()) {
    throw new Error(
      makeLogMessage(
        chalk.red(
          `${chalk.blueBright("@poyro/vitest")} can only be installed in projects that use ESModules. Please add the type field to your package.json, set it to "module", and ensure that your package runs and builds correctly. Once it does, try running this command again. Because this may be breaking for your project, we don't do this for you automatically.\n`
        )
      )
    );
  }

  // Get the installed version of vitest
  const vitestVersion = getDependencyVersion("vitest");

  // Check if vitest is installed
  if (!vitestVersion) {
    await confirm({
      message: `${chalk.blue("vitest")} is not installed. Would you like to also install it?`,
    });

    console.log(
      makeLogMessage(
        `Installing ${chalk.blueBright("vitest")} and ${chalk.blueBright("@poyro/vitest")}...`
      )
    );

    // Install vitest
    installWithRunner(["vitest", "@poyro/vitest"], { dev: true });

    // Update the package.json to include the test script
    await updatePackage();
  } else {
    console.log(
      makeLogMessage(
        `${chalk.blueBright("vitest@" + vitestVersion)} is already installed.`
      )
    );

    // Get the installed version of @poyro/vitest
    const poyroVitestVersion = getDependencyVersion("@poyro/vitest");

    // Check if @poyro/vitest is installed
    if (!poyroVitestVersion) {
      console.log(
        makeLogMessage(`Installing ${chalk.blueBright("@poyro/vitest")}...`)
      );

      // Install @poyro/vitest
      installWithRunner(["@poyro/vitest"], { dev: true });
    } else {
      console.log(
        makeLogMessage(
          `${chalk.blueBright("@poyro/vitest@" + poyroVitestVersion)} is already installed.`
        )
      );
    }
  }

  // Set up @poyro/vitest in the vitest setup file
  await makeVitestSetup();

  // Set up config to use the new vitest setup file
  await makeVitestConfig();

  // Update the vitest types
  await updateVitestTypes();

  // Update the tsconfig to include the vitest types
  updateTsconfig();
};
