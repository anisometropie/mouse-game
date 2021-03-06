import Vector from 'objects/Vector'
import { has, isNumber } from 'lodash'

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

  /**
   * Moves the point to given coordinates
   * you can provide either a point Object or x,y coords directly
   * @param {Point} point
   * @param {number|Point} x
   * @param {number} [y]
   */
  static move(point, x, y) {
    point.previousX = point.x
    point.previousY = point.y
    if (has(x, 'x')) {
      point.x = x.x
      point.y = x.y
    } else if (isNumber(x) && isNumber(y)) {
      point.x = x
      point.y = y
    }
  }

  move(x, y) {
    Point.move(this, x, y)
  }

  /**
   * Translates the point by a vector
   * you can provide either a vector Object or x,y coords directly
   * @param {Point} point
   * @param {number|Vector} x
   * @param {number} [y]
   */
  static translate(point, x, y) {
    point.previousX = point.x
    point.previousY = point.y
    if (has(x, 'x')) {
      point.x += x.x
      point.y += x.y
    } else if (isNumber(x) && isNumber(y)) {
      point.x += x
      point.y += y
    }
  }

  translate(x, y) {
    Point.translate(this, x, y)
  }

  static translated(point, vector) {
    return new Point(point.x + vector.x, point.y + vector.y)
  }

  translated(vector) {
    return Point.translated(this, vector)
  }

  static setX(point, value) {
    point.previousX = point.x
    point.x = value
  }

  setX(value) {
    Point.setX(this, value)
  }

  static setY(point, value) {
    point.previousY = point.y
    point.y = value
  }

  setY(value) {
    Point.setY(this, value)
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
