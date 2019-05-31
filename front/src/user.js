import Point from './Point'

function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`
}

export default class user {
  constructor(name, color, x = 300, y = 300, radius = 12) {
    this.x = x
    this.y = y
    this.prevX = 0
    this.prevY = 0
    this.radius = radius
    this.name = name
    this.color = color
  }

  move(x, y) {
    this.prevX = this.x
    this.prevY = this.y
    this.x += x
    this.y += y
  }

  moveTo(x, y) {
    this.prevX = this.x
    this.prevY = this.y
    this.x = x
    this.y = y
  }

  get coords() {
    return new Point(this.x, this.y)
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
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
    ctx.fillStyle = rgbToHex(red, green, blue)
    ctx.fill()
    ctx.closePath()
    if (withName) {
      ctx.fillText(this.name, this.x + this.radius, this.y + this.radius * 1.5)
    }
  }
}
