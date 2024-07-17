import { describe, expect, it } from "vitest";

import { downloadModel } from "../../downloadModel";
import { makeModel } from "../../makeModel";
import { checkIfRemote } from "../../utils";

import { outputFulfillsCriterion } from "./outputFulfillsCriterion";

declare global {
  // eslint-disable-next-line no-var -- We need to declare a global variable
  var poyro: Awaited<ReturnType<typeof makeModel>> | undefined;
}

const runOnRemote = await checkIfRemote();

if (!runOnRemote) {
  await downloadModel();

  const poyro = await makeModel();

  if (!global.poyro) {
    global.poyro = poyro;
  }
}

describe("outputFulfillsCriterion", () => {
  const trueExamples = [
    ["Hello, world!", "Says hello"],
    [
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions the first flight",
    ],
    [
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions 'the first manned airplane flight'",
    ],
    [
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions the first flight.",
    ],
  ];
  const falseExamples = [
    ["Bye", "Says hello"],
    [
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions the exact phrase 'the first flight'",
    ],
    [
      "The first manned airplane flight was in 1903, by the Wright brothers.",
      "Mentions cars",
    ],
  ];

  const allExamples = trueExamples.concat(falseExamples);

  it("all true - should pass for all examples", async () => {
    const results: boolean[] = [];

    for (const [output, criterion] of trueExamples) {
      const result = await outputFulfillsCriterion(output, criterion);
      results.push(result.result);
    }

    const allAreTrue = results.every((result) => result);

    expect(allAreTrue).toBe(true);
  }, 60000);

  it("all false - should fail for all examples", async () => {
    const results: boolean[] = [];

    for (const [output, criterion] of falseExamples) {
      const result = await outputFulfillsCriterion(output, criterion);
      results.push(result.result);
    }

    const allAreFalse = results.every((result) => !result);

    expect(allAreFalse).toBe(true);
  }, 60000);

  it("mixed - should fail for all examples", async () => {
    const results: boolean[] = [];

    for (const [output, criterion] of allExamples) {
      const result = await outputFulfillsCriterion(output, criterion);
      results.push(result.result);
    }

    const allAreTrue = results.every((result) => result);

    expect(allAreTrue).toBe(false);
  }, 60000);

  it("mixed - should pass for at least one examples", async () => {
    const results: boolean[] = [];

    for (const [output, criterion] of allExamples) {
      const result = await outputFulfillsCriterion(output, criterion);
      results.push(result.result);
    }

    const someAreTrue = results.some((result) => result);

    expect(someAreTrue).toBe(true);
  }, 60000);
});
