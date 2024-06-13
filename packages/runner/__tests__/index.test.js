const { sum } = require("../index");

describe("sum", () => {
  it("sum", () => {
    expect(sum(1, 2)).toBe(3);
  });
});
