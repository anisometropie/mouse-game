import { random } from 'lodash'

class Color {
  constructor(red, green, blue) {
    this.red = red
    this.green = green
    this.blue = blue
  }

  static random() {
    return new Color(random(0, 255), random(0, 255), random(0, 255))
  }
}

export default Color
