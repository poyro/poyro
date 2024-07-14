import { describe, expect, it } from "vitest";

import { downloadModel } from "../../downloadModel";
import { makeModel } from "../../makeModel";

import { outputFulfillsCriterion } from "./outputFulfillsCriterion";

declare global {
  // eslint-disable-next-line no-var -- We need to declare a global variable
  var poyro: Awaited<ReturnType<typeof makeModel>> | undefined;
}

await downloadModel();

const poyro = await makeModel();

if (!global.poyro) {
  global.poyro = poyro;
}

describe("outputFulfillsCriterion", () => {
  const trueExamples = [
    ["Hello, world!", "Says hello"],
    ["The first manned airplane flight was in 1903, by the Wright brothers.", "Mentions the first flight"],
    ["The first manned airplane flight was in 1903, by the Wright brothers.", "Mentions 'the first manned airplane flight'"],
    ["The first manned airplane flight was in 1903, by the Wright brothers.", "Mentions the first flight."]

  ];
  const falseExamples = [
    ["Bye", "Says hello"],
    ["The first manned airplane flight was in 1903, by the Wright brothers.", "Mentions the exact phrase 'the first flight'"],
    ["The first manned airplane flight was in 1903, by the Wright brothers.", "Mentions cars"]
  ]

  it("all true - should pass for all examples", async () => {
    const results = trueExamples.map(async ([output, criterion]) => {
      return (await outputFulfillsCriterion(output, criterion)).result;
    });
    const allAreTrue = (await Promise.all(results)).every(result => result);

    expect(allAreTrue).toBe(true);
  }, 10000)

  it("all false - should fail for all examples", async () => {
    const results = falseExamples.map(async ([output, criterion]) => {
      return (await outputFulfillsCriterion(output, criterion)).result;
    });
    const allAreFalse = (await Promise.all(results)).every(result => !result);

    expect(allAreFalse).toBe(true);
  }, 10000)
  
  it("mixed - should fail for all examples", async () => {
    const results = trueExamples.concat(falseExamples).map(async ([output, criterion]) => {
      return (await outputFulfillsCriterion(output, criterion)).result;
    });
    const someAreFalse = (await Promise.all(results)).every(result => result);

    expect(someAreFalse).toBe(false);
  }, 10000)

  it("mixed - should pass for at least one examples", async () => {
    const results = trueExamples.concat(falseExamples).map(async ([output, criterion]) => {
      return (await outputFulfillsCriterion(output, criterion)).result;
    });
    const someAreTrue = (await Promise.all(results)).some(result => result);

    expect(someAreTrue).toBe(true);
  }, 10000)
});
