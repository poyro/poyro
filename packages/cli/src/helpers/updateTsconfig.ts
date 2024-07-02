import chalk from "chalk";
import fs from "fs";

import { checkFileExists } from "./checkFileExists";
import { makeLogMessage } from "./makeLogMessage";

export const updateTsconfig = () => {
  // Check if the tsconfig.json file exists
  const [tsconfigExists, filename] = checkFileExists("tsconfig.json");

  // If the tsconfig.json file does not exist,
  // bail since there are no types to update
  if (!tsconfigExists) {
    return;
  }

  // Read the source code from the file
  const sourceCodeText = fs.readFileSync(filename, "utf8");

  // Parse the JSON source code
  const json = JSON.parse(sourceCodeText);

  // Check if the 'include' property exists
  if (json.include) {
    json.include = [...json.include, "vitest.d.ts"];
  } else {
    json.include = ["vitest.d.ts"];
  }

  // Write the transformed code to the file
  fs.writeFileSync(filename, JSON.stringify(json, null, 2));

  // Log the success message
  console.log(
    makeLogMessage(
      `${chalk.blueBright(
        "tsconfig.json"
      )} updated successfully to reference ${chalk.blueBright("vitest.d.ts")} types.`
    )
  );
};
