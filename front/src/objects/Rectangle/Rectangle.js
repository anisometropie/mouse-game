import Point from 'objects/Point'

class Rectangle {
  constructor(x, y, width, height, color, hasCollision = false, kills = false) {
    this.A = new Point(x, y)
    this.B = new Point(x + width, y)
    this.C = new Point(x + width, y + height)
    this.D = new Point(x, y + height)
    this.center = new Point(x + width / 2, y + height / 2)
    this.width = width
    this.height = height
    this.color = color
    this.hasCollision = hasCollision
    this.kills = kills
  }

  get vertices() {
    const { A, B, C, D } = this
    return {
      A,
      B,
      C,
      D
    }
  }

  get x() {
    return this.A.x
  }

  get y() {
    return this.A.y
  }

  static translate(rectangle, vector) {
    for (let vertice of Object.values(rectangle.vertices)) {
      vertice.translate(vector)
    }
    rectangle.center.translate(vector)
  }

  translate(vector) {
    Rectangle.translate(this, vector)
  }

  display(ctx, useOwnColor = true) {
    const { x, y, width, height } = this
    if (useOwnColor) {
      ctx.fillStyle = this.color ? this.color.hexString : '#000000'
    }
    ctx.fillRect(x, y, width, height)
  }
}

export default Rectangle
