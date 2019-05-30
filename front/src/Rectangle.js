import Point from './Point'

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  get vertices() {
    const { x, y, width, height } = this
    return {
      A: new Point(x, y),
      B: new Point(x + width, y),
      C: new Point(x + width, y + height),
      D: new Point(x, y + height)
    }
  }

  display(ctx) {
    const { x, y, width, height } = this
    ctx.fillRect(x, y, width, height)
  }
}

export default Rectangle
