import Vector from './Vector'

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  clone() {
    return new Point(this.x, this.y)
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
    return Point.distanceBetween(C, A.translated(AB.multiplied(t)))
  }
}

export default Point
