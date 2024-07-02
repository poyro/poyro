import { commentify } from "./commentify";

/**
 * Decode empty lines from a file.
 *
 * @param text - The text to decode
 * @param emptyLineMarker - The marker for empty lines
 * @param newLine - The new line character
 * @returns The decoded text
 */
export function decodeEmptyLines(
  text: string,
  emptyLineMarker = "!--empty-line--!",
  newLine = "\r\n"
) {
  const marker = commentify(emptyLineMarker);

  var lines = text.split(/\r?\n/);

  const uncommentedLines = lines.map((line) => (line == marker ? "" : line));

  return uncommentedLines.join(newLine);
}
