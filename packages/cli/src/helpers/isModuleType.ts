import { getPackageJson } from "./getPackageJson";

export const isModuleType = (): boolean => {
  const packageJson = getPackageJson();

  return packageJson.type === "module";
};
