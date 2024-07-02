import { describe, expect, it } from "vitest";

import { downloadModel } from "../../downloadModel";
import { makeModel } from "../../makeModel";

import { toFulfillCriterion } from "./toFulfillCriterion";

type MessageFn = () => string;

declare global {
  // eslint-disable-next-line no-var -- We need to declare a global variable
  var poyro: Awaited<ReturnType<typeof makeModel>> | undefined;
}

await downloadModel();

const poyro = await makeModel();

if (!global.poyro) {
  global.poyro = poyro;
}

describe("toFulfillCriterion", () => {
  it("should pass with a simple criterion", async () => {
    const result = await toFulfillCriterion("Hello, world!", "Says hello");

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);

  it("should behave correctly with mismatched result and criterion", async () => {
    const result = await toFulfillCriterion("Bye", "Says hello");

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);

  it("should pass with plaintext", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions the first flight"
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);

  it("should pass on exact matches with quotes", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions 'the first manned airplane flight'"
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);

  it("should fail on inexact matches with quotes", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions the exact phrase 'the first flight'"
    );

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);

  it("should pass with punctuation", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions the first flight."
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);

  it("should not pass when the criterion is not fulfilled", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions cars"
    );

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function) as MessageFn,
    });
  }, 10000);
});
