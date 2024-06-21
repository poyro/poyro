/**
 * Log a message to the console.
 *
 * @param message - The message to log
 * @returns Whether the message was successfully logged
 */
export const log = (message: string): boolean => {
  return process.stdout.write(message);
};
