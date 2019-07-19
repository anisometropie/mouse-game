import Circle from 'objects/Circle'

class User extends Circle {
  constructor(x, y, radius = 12, color, name, spawnPoint) {
    super(x, y, radius, color)
    this.name = name
    this.spawnPoint = spawnPoint
  }

  setName(name) {
    this.name = name
  }

  showCoords(ctx) {
    const { x, y } = this.center
    ctx.fillText(`${x} ${y}`, x + 12, y + 12)
  }

  kill() {
    const { x, y } = this.spawnPoint.center
    this.move(x, y)
  }
}

export default User
