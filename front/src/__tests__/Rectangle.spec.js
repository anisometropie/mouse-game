import Rectangle from "../Rectangle";

describe("Rectangle class", () => {
  it("should return its correct vertices", () => {
    const rect = new Rectangle(100, 100, 100, 100);
    expect(rect.vertices).toEqual([
      { x: 100, y: 100 },
      { x: 200, y: 100 },
      { x: 200, y: 200 },
      { x: 100, y: 200 }
    ]);
  });
});
