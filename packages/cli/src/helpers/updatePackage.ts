import fs from "fs";

import chalk from "chalk";
import { confirm, input } from "@inquirer/prompts";

import { checkFileExists } from "./checkFileExists";
import { makeLogMessage } from "./makeLogMessage";

export const updatePackage = async () => {
  // Check if the package.json file exists
  const [packageJsonExists, filename] = checkFileExists("package.json");

  // If the package.json file does not exist,
  // bail since there are no types to update
  if (!packageJsonExists) {
    throw new Error(
      makeLogMessage(
        chalk.red(
          "package.json does not exist. Please run this command in a project with a package.json file."
        )
      )
    );
  }

  // Read the source code from the file
  const sourceCodeText = fs.readFileSync(filename, "utf8");

  // Parse the JSON source code
  const json = JSON.parse(sourceCodeText);

  // Check if the 'scripts' property exists
  if (!json.scripts) {
    json.scripts = {};
  }

  // Check if the 'scripts.test' property exists
  if (json.scripts.test) {
    const confirmed = await confirm({
      message: `The test script already exists in your package.json file. Shall we overwrite it to be '"test": "vitest"'?`,
    });

    if (confirmed) {
      // Update the 'scripts.test' property to reference 'vitest'
      json.scripts.test = "vitest";
    } else {
      const alternate = await confirm({
        message: `Shall we create a new script in package.json to run vitest?`,
      });

      if (!alternate) {
        return console.log(makeLogMessage(chalk.red("Aborting...")));
      }

      // Prompt the user for the new script name
      const newScript = await input({
        message: `What would you like to name the new script?`,
        default: "test:vitest",
        validate: (input) => {
          if (!input) {
            return "Please enter a valid script name.";
          }

          if (json.scripts[input]) {
            return `The script name ${input} already exists. Please enter a different script name.`;
          }

          return true;
        },
      });

      // Update the 'scripts' property to include the new script
      json.scripts[newScript] = "vitest";
    }
  } else {
    // Update the 'scripts.test' property to reference 'vitest'
    json.scripts.test = "vitest";
  }

  // Write the transformed code to the file
  fs.writeFileSync(filename, JSON.stringify(json, null, 2));

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright(
        "package.json"
      )} updated successfully to reference ${chalk.blueBright("vitest.d.ts")} types.`
    )
  );
};
