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
  updatePackageScript,
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
    const confirmed = await confirm({
      message: `Your project does not have a type field set to "module" in your package.json. Would you like to set it now? ${chalk.redBright("Warning: This may break your project if it is not set up to use ESModules.")}`,
    });

    if (!confirmed) {
      console.log(
        makeLogMessage(
          chalk.red(
            "ESModules are recommended for Poyro. Not setting 'type' to 'module' may cause issues in your project."
          )
        )
      );
    }
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
    await updatePackageScript();
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
