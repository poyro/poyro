import fs from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadModel } from "../../downloadModel";

// mock the fetch function to avoid downloading
// the actual model file
vi.mock("node-fetch", () => {
  const fetch = async () => {
    return {
      ok: true,
      headers: {
        get: () => "1000",
      },
      body: fs.createReadStream(path.join(__dirname, "../__mocks__/test.txt"), {
        encoding: "utf-8",
      }),
    };
  };

  return { default: fetch };
});

// mock the logger to prevent unnecessary logs
vi.mock("../../utils/log");

describe("downloadModel - happyPath", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("should download the model successfully", async () => {
    // Download the model
    const filePath = await downloadModel();

    // Check if the file exists
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
