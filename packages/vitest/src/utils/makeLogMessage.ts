import chalk from "chalk";

import { name } from "../../package.json";

/**
 * This function creates a log message with the package name as a prefix.
 *
 * @param message - The message to log
 * @returns The formatted log message
 */
export const makeLogMessage = (message: string): string => {
  return `${chalk.bgWhite(chalk.black(name))} | ${message}`;
};
