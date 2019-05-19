export default class user {
  constructor(name, color) {
    this.x = 0
    this.y = 0
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
}
