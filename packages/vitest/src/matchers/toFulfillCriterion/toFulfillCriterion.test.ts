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
  console.log("Creating model...");
  global.poyro = poyro;
}

// populateGlobal(global, { poyro });

describe("toFulfillCriterion", () => {
  it.only("should pass with a simple criterion", async () => {
    const result = await toFulfillCriterion(
      "Hello, world!",
      "Is a simple greeting"
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 30000);

  it.only("should behave correctly with mismatched result and criterion", async () => {
    const result = await toFulfillCriterion("Bye", "Says hello");

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function) as MessageFn,
    });
  }, 30000);

  it("should pass with plaintext", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about airplanes"
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 30000);

  it("should pass with quotes", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about 'airplanes'"
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 30000);

  it("should pass with punctuation", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about airplanes."
    );

    expect(result).toMatchObject({
      pass: true,
      message: expect.any(Function) as MessageFn,
    });
  }, 30000);

  it("should not pass when the criterion is not fulfilled", async () => {
    const result = await toFulfillCriterion(
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Talks about cars"
    );

    expect(result).toMatchObject({
      pass: false,
      message: expect.any(Function) as MessageFn,
    });
  }, 30000);
});
