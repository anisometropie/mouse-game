import Point from 'objects/Point'
import { isPointInRectangle, circleIntersectsRectangle } from 'engine/physics'
import { pixelRatio } from 'utils/canvas'

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

  hasUserWalkedIn(user) {
    if (circleIntersectsRectangle(user, this) && this.kills) {
      return true
    }

    return false
  }

  isPointInside(point) {
    return isPointInRectangle(point, this)
  }

  drawBorder(ctx) {
    const { A, B, C, D } = this
    const prevColor = ctx.strokeStyle
    ctx.strokeStyle = '#000000'
    ctx.setLineDash([5 * pixelRatio, 15 * pixelRatio])
    ctx.beginPath()
    ctx.moveTo(A.x * pixelRatio, A.y * pixelRatio)
    ctx.lineTo(B.x * pixelRatio, B.y * pixelRatio)
    ctx.lineTo(C.x * pixelRatio, C.y * pixelRatio)
    ctx.lineTo(D.x * pixelRatio, D.y * pixelRatio)
    ctx.lineTo(A.x * pixelRatio, A.y * pixelRatio)
    ctx.closePath()
    ctx.stroke()
    ctx.setLineDash([])
    ctx.strokeStyle = prevColor
  }

  display(ctx, useOwnColor = true) {
    const { x, y, width, height } = this
    if (useOwnColor) {
      ctx.fillStyle = this.color
        ? this.color.hexString
        : this.kills
        ? 'red'
        : '#000000'
    }
    ctx.fillRect(
      x * pixelRatio,
      y * pixelRatio,
      width * pixelRatio,
      height * pixelRatio
    )
  }
}

export default Rectangle
