import fs from "node:fs";
import path from "node:path";

import fetch from "node-fetch";

import { version } from "../package.json";

import { makeLogMessage, log } from "./utils";
import { getModelUrl } from "./utils/getModelUrl";
import { getModelPath } from "./utils/getModelPath";

const calculateEta = (
  start: number,
  downloaded: number,
  total: number
): string => {
  const elapsed = performance.now() - start;
  const remaining = total - downloaded;
  const eta = (elapsed / downloaded) * remaining;

  // format the time in hours, minutes, and seconds
  const hours = Math.floor(eta / 3600000)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((eta % 3600000) / 60000)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor((eta % 60000) / 1000)
    .toString()
    .padStart(2, "0");

  return `${hours}h ${minutes}m ${seconds}s left`;
};

/**
 * This function downloads the local evaluation model from the Hugging Face model hub.
 *
 * @param testMode - Whether the function is being run in test mode
 * @returns The path to the downloaded model
 */
export const downloadModel = async (): Promise<string> => {
  // Get the directory path and filename for the model
  const { dirPath, filename } = getModelPath();

  // Create the directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Get the model URL for downloading
  const url = getModelUrl();

  // Download the file
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      makeLogMessage(`Failed to fetch ${url}: ${res.statusText}`)
    );
  }

  if (!res.body) {
    throw new Error(makeLogMessage("Could not get model body"));
  }

  // Get the total file size
  const contentLength = res.headers.get("content-length");

  if (contentLength === null) {
    throw new Error(makeLogMessage("Could not determine model size"));
  }

  const totalBytes = parseInt(contentLength, 10);
  let downloadedLength = 0;

  // Put together the file path
  const filePath = path.join(dirPath, filename);

  // If the file already exists, skip the download
  if (fs.existsSync(filePath)) {
    // Check if the file is the correct size, if so, skip the download
    if (fs.statSync(filePath).size === totalBytes) {
      log(
        makeLogMessage("Evaluation model already exists, skipping download.")
      );
      return filePath;
    }

    // Otherwise, delete the file and re-download it
    fs.unlinkSync(filePath);
  }

  log(
    makeLogMessage(
      `Looks like it's the first time you're using @poyro/vitest@${version}. Welcome! Before we can begin testing, we need to download our evaluation model. This will only take a moment...\n`
    )
  );

  const startTime = performance.now();

  // Write the file to disk
  const fileStream = fs.createWriteStream(filePath);

  // Log the download progress
  res.body.on("data", (chunk: Buffer) => {
    downloadedLength += chunk.length;
    const downloadedMb = Math.floor(downloadedLength / 10e5).toLocaleString();
    const totalMb = Math.floor(totalBytes / 10e5).toLocaleString();
    const percentage = ((downloadedLength / totalBytes) * 100).toFixed(2);
    const eta = calculateEta(startTime, downloadedLength, totalBytes);
    const message = makeLogMessage(
      `Downloading evaluation model: ${downloadedMb}MB/${totalMb}MB | ${percentage}% complete | ${eta}`
    );
    log(`\r${message}`);
  });

  // Wait for the file to finish downloading
  await new Promise((resolve, reject) => {
    res.body?.pipe(fileStream);
    res.body?.on("error", reject);
    fileStream.on("finish", resolve);
  })
    .then(() => {
      log(makeLogMessage("Model downloaded successfully."));
    })
    .catch((err) => {
      throw new Error(makeLogMessage(`Failed to download model: ${err}`));
    });

  // Return the model
  return filePath;
};
