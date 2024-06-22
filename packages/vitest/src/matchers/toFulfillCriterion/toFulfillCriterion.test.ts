import { beforeAll, describe, expect, it } from "vitest";

import { downloadModel } from "../../downloadModel";

import { toFulfillCriterion } from "./toFulfillCriterion";

describe("toFulfillCriterion", () => {
  beforeAll(async () => {
    await downloadModel();
  }, 300000);

  it("should pass with a simple criterion", async () => {
    const result = await toFulfillCriterion(
      "Hello, world!",
      "Is a simple greeting"
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should behave correctly with mismatched result and criterion", async () => {
    const result = await toFulfillCriterion("Bye", "Says hello");

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function),
    });
  }, 30000);

  it("should pass with plaintext", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about airplanes"
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should pass with quotes", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about 'airplanes'"
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should pass with punctuation", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about airplanes."
    );

    expect(result).toMatchObject({ pass: true, message: expect.any(Function) });
  }, 30000);

  it("should not pass when the criterion is not fulfilled", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about cars"
    );

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function),
    });
  }, 30000);
});
