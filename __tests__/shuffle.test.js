const shuffle = require("../src/shuffle");

describe("shuffle should...", () => {
  test("return an array", () => {
    const result = shuffle([1, 2, 3]);
    expect(Array.isArray(result)).toBe(true);
  });

  test("return an array of the same length as the argument", () => {
    const input = [1, 2, 3];
    const result = shuffle(input);
    expect(result.length).toBe(input.length);
  });
});
