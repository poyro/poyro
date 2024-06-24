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
        // to do this:
        // 1. open the 'downloadModel.ts' file
        // 2. find the 'contentLength' variable
        // 3. log the value of 'contentLength' to the console
        // 4. copy the value from the console and paste it here
        // 5. delete the 'console.log(contentLength)' line
        get: () => "4920734464",
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

// mock the unlinkSync function to avoid deleting the
// actual model file
vi.mock("node:fs", async (importOriginal) => {
  const mod = await importOriginal();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- We need to return the module
  return {
    ...(mod as any),
    unlinkSync: vi.fn(),
  };
});

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
