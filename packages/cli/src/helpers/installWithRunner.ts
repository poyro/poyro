import { execSync } from "child_process";

import { getPackageRunner } from "./getPackageRunner";

export interface InstallWithRunnerOptions {
  dev?: boolean;
}

export const installWithRunner = (
  packages: string[],
  { dev }: InstallWithRunnerOptions = {}
) => {
  const runner = getPackageRunner();

  if (runner === "npm") {
    return execSync(
      `npm install ${dev ? "--save-dev" : "--save"} ${packages.join(" ")}`,
      { stdio: "inherit" }
    );
  }

  if (runner === "yarn") {
    return execSync(`yarn add ${dev ? "--dev" : ""} ${packages.join(" ")}`, {
      stdio: "inherit",
    });
  }

  if (runner === "pnpm") {
    return execSync(
      `pnpm add ${dev ? "--save-dev" : "--save"} ${packages.join(" ")}`,
      { stdio: "inherit" }
    );
  }

  throw new Error(`Unknown runner: ${runner}`);
};
