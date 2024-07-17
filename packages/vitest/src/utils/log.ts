/**
 * Log a message to the console.
 *
 * @param message - The message to log
 * @returns Whether the message was successfully logged
 */
export const log = (message: string): boolean => {
  if (process.env.CI === "true") {
    console.log(message);
    return true;
  }

  return process.stdout.write(message);
};
