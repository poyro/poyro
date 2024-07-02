import fs from "fs";

import chalk from "chalk";
import { confirm, input } from "@inquirer/prompts";

import { checkFileExists } from "./checkFileExists";
import { makeLogMessage } from "./makeLogMessage";

export const updatePackageType = async () => {
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
  if (!json.type) {
    json.type = "module";
  }

  // Check if the 'scripts.test' property exists
  if (json.type !== "module") {
    const confirmed = await confirm({
      message: `A type is already defined as '${json.type}' in your package.json file. Shall we overwrite it to be '"type": "module"'?`,
    });

    if (confirmed) {
      // Update the 'scripts.test' property to reference 'vitest'
      json.type = "module";
    } else {
      return console.log(
        makeLogMessage(
          chalk.red(
            "ESModules are recommended for Poyro. Not setting 'type' to 'module' may cause issues in your project."
          )
        )
      );
    }
  }

  // Write the transformed code to the file
  fs.writeFileSync(filename, JSON.stringify(json, null, 2));

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright(
        "package.json"
      )} updated successfully to use "type": "module".`
    )
  );
};
