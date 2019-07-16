import RectangleBuilder from 'objects/Rectangle'
import Point from 'objects/Point'
import TrapSystem from 'objects/TrapSystem'

/**
 * @param {number} x — x axis position
 * @param {number} y — y axis position
 * @param {number} horizontalSize — number of horizontal cells
 * @param {number} verticalSize — number of vertical cells
 * @param {number} cellWidth — width of each cell
 * @param {number} cellHeight — height of each cell
 * @param {Interval} evenTiming — interval even in on
 * @param {Interval} oddTiming — interval odd in on
 * @param {number} cycleDuration — time of the whole cycle (ms)
 */

class CheckerboardBuilder {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  withSize(horizontalSize, verticalSize) {
    this.horizontalSize = horizontalSize
    this.verticalSize = verticalSize
    return this
  }

  withCellSize(cellWidth, cellHeight) {
    this.cellWidth = cellWidth
    this.cellHeight = cellHeight
    return this
  }

  withTiming(evenTiming, oddTiming) {
    this.evenTiming = evenTiming
    this.oddTiming = oddTiming
    return this
  }

  withCycleDuration(cycleDuration) {
    this.cycleDuration = cycleDuration
    return this
  }

  build() {
    const evenVerticalNumber = Math.ceil(this.verticalSize / 2)
    const oddVerticalNumber = Math.floor(this.verticalSize / 2)
    const group1 = []
    const group2 = []
    for (let i = 0; i < this.horizontalSize; i++) {
      const even = []
      const odd = []
      for (let j = 0; j < evenVerticalNumber; j++) {
        even.push(
          new RectangleBuilder(
            this.cellWidth * i,
            2 * this.cellHeight * j,
            this.cellWidth,
            this.cellHeight
          ).build()
        )
      }
      for (let j = 0; j < oddVerticalNumber; j++) {
        odd.push(
          new RectangleBuilder(
            this.cellWidth * i,
            this.cellHeight + 2 * this.cellHeight * j,
            this.cellWidth,
            this.cellHeight
          ).build()
        )
      }
      group1.push(...(i % 2 === 0 ? even : odd))
      group2.push(...(i % 2 === 0 ? odd : even))
    }

    return new TrapSystem(
      this.x,
      this.y,
      [
        {
          traps: group1,
          timing: this.evenTiming,
          on: true
        },
        {
          traps: group2,
          timing: this.oddTiming,
          on: false
        }
      ],
      this.cycleDuration
    )
  }
}

export default CheckerboardBuilder
