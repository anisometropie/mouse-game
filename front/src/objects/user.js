import Point from 'objects/Point'
import Vector from 'objects/Vector'
import { has, isNumber } from 'lodash'

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

class User {
  constructor(name, color, x = 600, y = 300, radius = 12) {
    this.center = new Point(x, y)
    this.radius = radius
    this.name = name
    this.color = color
  }

  translate(x, y) {
    if (has(x, 'x')) {
      this.center.translate(x)
    } else if (isNumber(x) && isNumber(y)) {
      this.center.translate(new Vector(x, y))
    }
  }

  move(x, y) {
    this.center.move(x, y)
  }

  get coords() {
    return this.center
  }

  setColor(color) {
    this.color = color
  }

  setName(name) {
    this.name = name
  }

  display(ctx, withName = false) {
    const { red, green, blue } = this.color
    ctx.beginPath()
    ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = rgbToHex(red, green, blue)
    ctx.fill()
    ctx.closePath()
    if (withName) {
      ctx.fillText(
        this.name,
        this.center.x + this.radius,
        this.center.y + this.radius * 1.5
      )
    }
  }
}

export default User
