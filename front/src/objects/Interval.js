import { first, last } from 'lodash'
class Interval {
  constructor(string) {
    const bounds = string.match(/-?\d+/g)
    this.leftBound = +bounds[0]
    this.rightBound = +bounds[1]
    this.leftOpen = /[\]\(]/.test(first(string))
    this.rightOpen = /[\[\)]/.test(last(string))
  }

  contains(number) {
    const left = this.leftOpen
      ? this.leftBound < number
      : this.leftBound <= number
    const right = this.rightOpen
      ? number < this.rightBound
      : number <= this.rightBound
    return left && right
  }
}

export default Interval
