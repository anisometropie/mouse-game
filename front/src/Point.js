class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static distanceBetween(a, b) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
  }
}

export default Point
