import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadModel } from "../../downloadModel";

// mock the find-cache-dir package to return undefined (error state)
vi.mock("find-cache-dir", () => {
  return { default: () => undefined };
});

describe("downloadModel - findCacheDir errors", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("should throw an error if the cache directory could not be identified", async () => {
    // Check if the function throws an error
    await expect(downloadModel()).rejects.toThrow(
      "Could not identify cache directory"
    );
  });
});
