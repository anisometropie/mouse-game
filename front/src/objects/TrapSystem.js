import Vector from 'objects/Vector'
import Interval from 'objects/Interval'
import { circleIntersectsRectangle } from 'engine/physics'

const TRAP_TIMING_STEP = 100
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
   * @param { { traps: Rectangle[], timing: Interval[] }[] } groups
      — represent trap groups
        each group has an array of traps
        and a timing array, which represents when the trap is on
   * @param {number} cycleLength
   */
  constructor(x, y, groups = [], cycleLength = 500) {
    this.x = x
    this.y = y
    this.groups = groups
    this.cycleLength = cycleLength
    this.currentTime = 0
    this.timestamp = 0
    this.timeShift = 0
    this.loop = setInterval(this.toggleTraps.bind(this), TRAP_TIMING_STEP)
    const vector = new Vector(this.x, this.y)
    for (let g of this.groups) {
      for (let t of g.traps) {
        t.translate(vector)
      }
    }
  }

  clone() {
    const prototype = Object.getPrototypeOf(this)
    const obj = Object.create(prototype)
    for (const key of Reflect.ownKeys(this)) {
      const descriptors = Reflect.getOwnPropertyDescriptor(this, key)
      Reflect.defineProperty(obj, key, descriptors)
    }
    return obj
  }

  /**
   * defines where the zero should be
   */
  setTimestamp(timestamp) {
    this.timestamp = timestamp
    this.setTimeShift()
  }

  setTimeShift() {
    this.currentTime = 0
    this.timeShift = (new Date() - this.timestamp) % this.cycleLength
    clearInterval(this.loop)
    this.loop = setInterval(this.toggleTraps.bind(this), TRAP_TIMING_STEP)
  }

  toggleTraps() {
    const relativeTime = (this.currentTime + this.timeShift) % this.cycleLength
    for (let g of this.groups) {
      if (g.timing.contains(relativeTime) && !g.on) {
        g.on = true
        for (let t of g.traps) {
          t.kills = true
        }
      } else if (!g.timing.contains(relativeTime) && g.on) {
        g.on = false
        for (let t of g.traps) {
          t.kills = false
        }
      }
    }
    this.currentTime = (this.currentTime + TRAP_TIMING_STEP) % this.cycleLength
  }

  addGroup() {
    this.groups.push({ traps: [], timing: new Interval('[0, 0[') })
  }

  deleteGroup(index) {
    this.groups.splice(index, 1)
  }

  addedGroup() {
    const clone = this.clone()
    clone.addGroup()
    return clone
  }

  deletedGroup(index) {
    const clone = this.clone()
    clone.deleteGroup(index)
    return clone
  }

  editTiming(groupIndex, leftBound, rightBound) {
    this.groups[groupIndex].timing = new Interval(
      `[${leftBound}, ${rightBound}[`
    )
  }

  editedTiming(groupIndex, leftBound, rightBound) {
    const clone = this.clone()
    clone.editTiming(groupIndex, leftBound, rightBound)
    return clone
  }

  display(ctx) {
    for (let g of this.groups) {
      ctx.fillStyle = g.on ? 'red' : 'lime'
      for (let t of g.traps) {
        t.display(ctx, false)
      }
    }
  }

  hasUserWalkedIn(user) {
    for (let g of this.groups) {
      for (let t of g.traps) {
        if (circleIntersectsRectangle(user, t) && g.on) {
          return true
        }
      }
    }
    return false
  }
}

export default TrapSystem
