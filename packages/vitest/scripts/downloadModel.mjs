import fs from "node:fs";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import fetch from "node-fetch";

import packageJson from "../package.json" with { type: "json" };

const { name } = packageJson;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const constants = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "constants.json"), "utf8")
);

const filename = constants.model.filename;
const url = `https://huggingface.co/${constants.model.org}/${constants.model.repo}/resolve/main/${filename}?download=true`;
const dirPath = path.join(__dirname, "..", "bin");
const filePath = path.join(dirPath, filename);

const main = async () => {
  // Create the directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Download the file
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`${name}: Failed to fetch ${url}: ${res.statusText}`);
  }

  // Get the total file size
  const totalBytes = parseInt(res.headers.get("content-length"), 10);

  // If the file already exists, skip the download
  if (fs.existsSync(filePath)) {
    // Check if the file is the correct size, if so, skip the download
    if (fs.statSync(filePath).size === totalBytes) {
      console.log(`${name}: Model already exists, skipping download.`);
      return filename;
    }

    // Otherwise, delete the file and re-download it
    fs.unlinkSync(filePath);
  }

  console.log(`${name}: Downloading '${filename}'...`);

  // Write the file to disk
  const fileStream = fs.createWriteStream(filePath);

  // Wait for the file to finish downloading
  await new Promise((resolve, reject) => {
    res.body.pipe(fileStream);
    res.body.on("error", reject);
    fileStream.on("finish", resolve);
  });

  // Return the model
  return filename;
};

main()
  .then((filename) => {
    console.log(`${name}: Model download complete: '${filename}"`);
  })
  .catch((err) => {
    console.error(`${name}: Error downloading file:`, err);
    process.exit(1);
  });
