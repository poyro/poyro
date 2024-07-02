import { getPackageJson } from "./getPackageJson";

export const getDependencyVersion = (
  dependency: string
): string | undefined => {
  const packageJson = getPackageJson();

  return (
    packageJson.dependencies?.[dependency] ||
    packageJson.devDependencies?.[dependency]
  );
};
