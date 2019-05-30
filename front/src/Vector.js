import Point from './Point'

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  static fromPoints(start, end) {
    return new Vector(end.x - start.x, end.y - start.y)
  }

  static fromPolar(length, angle) {
    return new Vector(length * Math.cos(angle), length * Math.sin(angle))
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

  get angle() {
    return Math.atan2(this.y, this.x)
  }

  get length() {
    return Point.distanceBetween({ x: 0, y: 0 }, this)
  }

  get squaredLength() {
    return Point.squaredDistanceBetween({ x: 0, y: 0 }, this)
  }

  set length(length) {
    if (length === 0) {
      this.x = 0
      this.y = 0
    } else if (length > 0) {
      const ratio = length / this.length
      this.x *= ratio
      this.y *= ratio
    }
  }
}

export default Vector
