import Vector from './Vector'

class Point {
  constructor(x, y) {
    this.previousX = x
    this.previousY = y
    this.x = x
    this.y = y
  }

  clone() {
    return new Point(this.x, this.y)
  }

  static move(point, x, y) {
    point.previousX = point.x
    point.previousY = point.y
    point.x = x
    point.y = y
  }

  move(x, y) {
    Point.move(this, x, y)
  }

  static translate(point, vector) {
    point.previousX = point.x
    point.previousY = point.y
    point.x += vector.x
    point.y += vector.y
  }

  translate(vector) {
    Point.translate(this, vector)
  }

  static translated(point, vector) {
    return new Point(point.x + vector.x, point.y + vector.y)
  }

  translated(vector) {
    return Point.translated(this, vector)
  }

  static distanceBetween(a, b) {
    return Math.sqrt(Point.squaredDistanceBetween(a, b))
  }

  static squaredDistanceBetween(a, b) {
    return (b.x - a.x) ** 2 + (b.y - a.y) ** 2
  }

  static distanceToSegment(C, [A, B]) {
    const AB = Vector.fromPoints(A, B)
    if (AB.length === 0) {
      return Point.distanceBetween(C, A)
    }
    //        C
    //        |
    //        |
    // A——————D—————————B
    const AC = Vector.fromPoints(A, C)
    const AD_ABsignedRatio = AC.dotProduct(AB) / AB.squaredLength
    const t = Math.max(0, Math.min(1, AD_ABsignedRatio))
    const closestPoint = A.translated(AB.multiplied(t))
    return { distance: Point.distanceBetween(C, closestPoint), closestPoint }
  }
}

export default Point
