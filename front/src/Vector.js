import Point from './Point'

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static fromPoints(start, end) {
    return new Vector(end.x - start.x, end.y - start.y)
  }

  clone() {
    return new Vector(this.x, this.y)
  }

  static dotProduct(u, v) {
    return u.x * v.x + u.y * v.y
  }

  dotProduct(u) {
    return Vector.dotProduct(this, u)
  }

  static rotate(vector, angle) {
    const { x, y } = vector
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    vector.x = x * cos - y * sin
    vector.y = x * sin + y * cos
  }

  rotate(angle) {
    Vector.rotate(this, angle)
  }

  static rotated(vector, angle) {
    const clone = vector.clone()
    Vector.rotate(clone, angle)
    return clone
  }

  rotated(angle) {
    return Vector.rotated(this, angle)
  }

  get length() {
    return Point.distanceBetween({ x: 0, y: 0 }, this)
  }
}

export default Vector
