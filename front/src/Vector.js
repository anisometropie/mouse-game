import Point from './Point'

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static fromPoints(start, end) {
    return new Vector(end.x - start.x, end.y - start.y)
  }

  static dotProduct(u, v) {
    return u.x * v.x + u.y * v.y
  }

  dot(u) {
    return Vector.dotProduct(this, u)
  }

  get length() {
    return Point.distanceBetween({ x: 0, y: 0 }, this)
  }

  rotate(angle) {
    const { x: oldX, y: oldY } = this
    this.x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
    this.y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
  }
}

export default Vector
