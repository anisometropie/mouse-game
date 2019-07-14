const TRAP_TIMING_STEP = 1000
/**
  * A set of multiple traps.
  * Deals with the timing each trap turns on and off
  * works with an internal relative coordinate system,
    centered in x,y given in the constructor
  * deals with displaying each rectangle
*/

class TrapSystem {
  /**
   * @param {number} x — x coordinate
   * @param {number} y — y coordinate
   * @param {{traps: Array, timing: Interval[]}[]} groups
      — represent trap groups
        each group has an array of traps
        and a timing array, which represents when the trap is on
   * @param {number} cycleLength
   */
  constructor(x, y, groups, cycleLength) {
    this.x = x
    this.y = y
    this.groups = groups
    this.cycleLength = cycleLength
    this.currentTime = 0
    this.loop = setInterval(this.toggleTraps.bind(this), TRAP_TIMING_STEP)
  }

  toggleTraps() {
    for (let g of this.groups) {
      if (g.timing.contains(this.currentTime) && !g.on) {
        g.on = true
        for (let t of g.traps) {
          t.kills = true
        }
      } else if (!g.timing.contains(this.currentTime) && g.on) {
        g.on = false
        for (let t of g.traps) {
          t.kills = false
        }
      }
    }
    this.currentTime = (this.currentTime + TRAP_TIMING_STEP) % this.cycleLength
  }

  display(ctx) {
    for (let g of this.groups) {
      ctx.fillStyle = g.on ? 'red' : 'green'

      for (let t of g.traps) {
        t.display(ctx)
      }
    }
  }
}

export default TrapSystem
