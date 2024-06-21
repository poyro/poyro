import { beforeAll, describe, expect, it } from "vitest";

import { downloadModel } from "../../downloadModel";

import { toFulfillCriterion } from "./toFulfillCriterion";

describe("toFulfillCriterion", () => {
  beforeAll(async () => {
    await downloadModel();
  }, 300000);

  it("should pass with plaintext", async () => {
    const testString =
      "The first manned airplane flight was in 1903, by the Wright brothers.";

    const result = await toFulfillCriterion(
      testString,
      "Talks about airplanes"
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should pass with quotes", async () => {
    const testString =
      "The first manned airplane flight was in 1903, by the Wright brothers.";

    const result = await toFulfillCriterion(
      testString,
      "Talks about 'airplanes'"
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should pass with punctuation", async () => {
    const testString =
      "The first manned airplane flight was in 1903, by the Wright brothers.";

    const result = await toFulfillCriterion(
      testString,
      "Talks about airplanes."
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should not pass when the criterion is not fulfilled", async () => {
    const testString =
      "The first manned airplane flight was in 1903, by the Wright brothers.";

    const result = await toFulfillCriterion(testString, "Talks about cars");

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function),
    });
  }, 30000);
});
