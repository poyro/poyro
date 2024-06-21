import { afterEach, describe, expect, it, vi } from "vitest";

import { downloadModel } from "../../downloadModel";
import { makeLogMessage } from "../../utils";

const mocks = vi.hoisted(() => {
  return {
    fetchMock: vi.fn(),
    getModelUrlMock: vi
      .fn()
      .mockReturnValue(
        "https://huggingface.co/org/repo/resolve/main/model.zip?download=true"
      ),
  };
});

// mock the fetch function to avoid downloading
// the actual model file
vi.mock("node-fetch", () => {
  return { default: mocks.fetchMock };
});

// mock the logger to prevent unnecessary logs
vi.mock("../../utils/log");

//
vi.mock("../../utils/getModelUrl", () => {
  return { getModelUrl: mocks.getModelUrlMock };
});

describe("downloadModel - fetch errors", () => {
  afterEach(() => {
    vi.resetModules();
  });

  it("should throw when not ok", async () => {
    mocks.fetchMock.mockResolvedValue({
      ok: false,
      statusText: "Not Found",
    });

    await expect(downloadModel()).rejects.toThrow(
      makeLogMessage(
        `Failed to fetch https://huggingface.co/org/repo/resolve/main/model.zip?download=true: Not Found`
      )
    );
  });

  it("should throw when body is not defined", async () => {
    mocks.fetchMock.mockResolvedValue({
      ok: true,
      body: undefined,
    });

    await expect(downloadModel()).rejects.toThrow(
      makeLogMessage("Could not get model body")
    );
  });

  it("should throw when content-length is not defined", async () => {
    mocks.fetchMock.mockResolvedValue({
      ok: true,
      body: "body",
      headers: { get: () => null },
    });

    await expect(downloadModel()).rejects.toThrow(
      makeLogMessage("Could not determine model size")
    );
  });
});
