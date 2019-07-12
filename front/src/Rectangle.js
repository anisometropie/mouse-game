import Point from './Point'

class Rectangle {
  constructor(x, y, width, height, hasCollision = true) {
    this.x = x
    this.y = y
    this.center = new Point(x + width / 2, y + height / 2)
    this.width = width
    this.height = height
    this.A = new Point(x, y)
    this.B = new Point(x + width, y)
    this.C = new Point(x + width, y + height)
    this.D = new Point(x, y + height)
    this.hasCollision = hasCollision
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

  display(ctx) {
    const { x, y, width, height } = this
    ctx.fillRect(x, y, width, height)
  }
}

export default Rectangle
