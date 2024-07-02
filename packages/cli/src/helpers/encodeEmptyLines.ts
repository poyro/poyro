import { commentify } from "./commentify";

/**
 * Encode empty lines from a file.
 *
 * @param text - The text to encode
 * @param emptyLineMarker - The marker for empty lines
 * @param newLine - The new line character
 * @returns The encoded text
 */
export function encodeEmptyLines(
  text: string,
  emptyLineMarker = "!--empty-line--!",
  newLine = "\r\n"
) {
  const marker = commentify(emptyLineMarker);

  const lines = text.split(/\r?\n/);

  const commentedLines = lines.map((line) =>
    line.trim() == "" ? marker : line
  );

  return commentedLines.join(newLine);
}
