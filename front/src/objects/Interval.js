class Interval {
  constructor(leftBound, rightBound) {
    this.leftBound = leftBound
    this.rightBound = rightBound
  }

  contains(number) {
    return this.leftBound <= number && number <= this.rightBound
  }
}

export default Interval
