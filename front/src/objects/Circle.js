import { rgbToHex } from 'utils/colors'
import { pixelRatio } from 'utils/canvas'

import Point from 'objects/Point'
import Vector from 'objects/Vector'
import { has, isNumber } from 'lodash'

class Circle {
  constructor(x, y, radius = 12, color) {
    this.center = new Point(x, y)
    this.radius = radius
    this.color = color
  }

  clone() {
    return new Circle(this.x, this.y, this.radius, this.color)
  }
  /**
   * Moves the circle to given coordinates
   * you can provide either a point Object or x,y coords directly
   * @param {number|Point} x
   * @param {number} [y]
   */
  move(x, y) {
    this.center.move(x, y)
  }

  /**
   * Translates the circle by a vector
   * you can provide either a vector Object or x,y coords directly
   * @param {number|Vector} x
   * @param {number} [y]
   */
  translate(x, y) {
    this.center.translate(x, y)
  }

  get coords() {
    return this.center
  }

  setColor(color) {
    this.color = color
  }

  display(ctx, withName = false) {
    const { red, green, blue } = this.color
    ctx.beginPath()
    ctx.arc(
      this.center.x * pixelRatio,
      this.center.y * pixelRatio,
      this.radius * pixelRatio,
      0,
      Math.PI * 2
    )
    ctx.fillStyle = rgbToHex(red, green, blue)
    ctx.fill()
    ctx.closePath()
    if (withName) {
      ctx.fillText(
        this.name,
        (this.center.x + this.radius) * pixelRatio,
        (this.center.y + this.radius * 1.5) * pixelRatio
      )
    }
  }
}

export default Circle
