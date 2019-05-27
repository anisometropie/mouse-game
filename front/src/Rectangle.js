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
      A: { x, y },
      B: { x: x + width, y },
      C: { x: x + width, y: y + height },
      D: { x, y: y + height }
    }
  }

  display(ctx) {
    const { x, y, width, height } = this
    ctx.fillRect(x, y, width, height)
  }
}

export default Rectangle
