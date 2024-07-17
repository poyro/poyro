import { getConfig } from "./getConfig";

export const checkIfRemote = async (): Promise<boolean> => {
  // Get the config
  const { remote } = await getConfig();

  // If remote is disabled, return false
  if (remote?.enabled === false) {
    return false;
  }

  // If POYRO_API_KEY is set...
  if (process.env.POYRO_API_KEY) {
    // ...and remote is enabled, return true
    if (remote?.enabled === true || remote?.enabled === undefined) {
      return true;
    }

    // Otherwise, throw an error
    throw new Error(
      "Remote is enabled, but POYRO_API_KEY is not set in the environment."
    );
  }

  // Otherwise, return false
  return false;
};
