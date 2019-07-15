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

  kill() {
    const { x, y } = this.spawnPoint.center
    this.move(x, y)
  }
}

export default User
