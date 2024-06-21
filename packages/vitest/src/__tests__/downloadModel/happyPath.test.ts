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
        // set this equal to the size of the real model
        // to avoid accidentally downloading the real model
        get: () => "2719242496",
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
