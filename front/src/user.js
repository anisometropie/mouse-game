function componentToHex(c) {
  var hex = c.toString(16)
  return hex.length == 1 ? '0' + hex : hex
}

function rgbToHex(r, g, b) {
  return `#${componentToHex(r)}${componentToHex(g)}{$componentToHex(b)}`
}

export default class user {
  constructor(name, color, x = 0, y = 0) {
    this.x = x
    this.y = y
    this.name = name
    this.color = color
  }

  move(x, y) {
    this.x = x
    this.y = y
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
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2)
    ctx.fillStyle = rgbToHex(red, green, blue)
    ctx.fill()
    ctx.closePath()
    if (withName) {
      ctx.fillText(this.name, this.x + 12, this.y + 18)
    }
  }
}
