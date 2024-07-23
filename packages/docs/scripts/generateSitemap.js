#!/usr/bin/env node
import { spawnSync } from "child_process";
import { writeFileSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { fileURLToPath } from "url";

import fg from "fast-glob";
import { SitemapStream, streamToPromise } from "sitemap";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const main = async () => {
  const pkgRoot = path.resolve(__dirname, "..");

  // First, get all markdown files
  const files = fg.sync([path.join(pkgRoot, "src/app/**/*.md")], {
    ignore: ["node_modules"],
  });

  // Generate the sourcemap array
  const sourcemapArr = files.map((file) => {
    // Get the last commit date
    const { stdout } = spawnSync("git", ["log", "-1", "--format=%cd", file], {
      encoding: "utf-8",
    });

    // Parse the date
    const dateStr = stdout.trim();

    // Create a date object
    const date = new Date(dateStr);

    return {
      url: file.replace(pkgRoot + "/src/app", "").replace("/page.md", ""),
      lastmod: date,
      priority: file === path.join(pkgRoot, "src/app/page.md") ? 1.0 : 0.8,
    };
  });

  // Create a stream to write to
  const stream = new SitemapStream({ hostname: "https://docs.poyro.dev" });

  // Write the sourcemap array to the stream
  const promise = await streamToPromise(
    Readable.from(sourcemapArr).pipe(stream)
  ).then((data) => data.toString());

  // Write the sitemap to a file
  writeFileSync(path.join(pkgRoot, "src/app/sitemap.xml"), promise);
};

await main();
