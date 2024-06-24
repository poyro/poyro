// import { makeModel } from "../makeModel";
// import { toFulfillCriterion } from "../matchers";

import { makeModel, toFulfillCriterion } from "../../dist/index.js";

const poyro = await makeModel();

global.poyro = poyro;

console.time("a1");
const a1 = await toFulfillCriterion("Hello, world!", "Says hello");
console.timeEnd("a1");

console.time("a2");
const a2 = await toFulfillCriterion(
  "The first manned airplane flight was in 1903, by the Wright brothers.",
  "Mentions the first flight"
);
console.timeEnd("a2");
