import { random, isString, isNumber } from 'lodash'
import { colors, hexToRgb, rgbToHex } from 'utils/colors'

class Color {
  /**
   * @param {number|string} v1 — decimal red value OR HTML color name OR hexstring
   * @param {number} v2 — decimal green value
   * @param {number} v3 — decimal blue value
   */
  constructor(v1 = 0, v2 = 0, v3 = 0) {
    if (isString(v1)) {
      const { red, green, blue } = hexToRgb(
        v1.startsWith('#') ? v1 : colors[v1]
      )
      this.red = red
      this.green = green
      this.blue = blue
    } else if (isNumber(v1) && isNumber(v2) && isNumber(v3)) {
      this.red = v1
      this.green = v2
      this.blue = v3
    } else {
      throw new Error('Invalid input for new Color.')
    }
    this.hexString = rgbToHex(this.red, this.green, this.blue)
  }

  static random() {
    return new Color(random(0, 255), random(0, 255), random(0, 255))
  }
}

export default Color
