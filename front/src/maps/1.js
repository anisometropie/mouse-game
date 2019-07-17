import RectangleBuilder from 'objects/Rectangle'
import Point from 'objects/Point'
import TrapSystem from 'objects/TrapSystem'
import Interval from 'objects/Interval'
import Color from 'effects/Color'

const spawn = new RectangleBuilder(20 * 2, 100 * 2, 80 * 2, 80 * 2)
  .withColor(new Color('lightblue'))
  .build()

// WALLS
const walls = [
  spawn,
  new RectangleBuilder(0 * 2, 80 * 2, 20 * 2, 120 * 2).makeCollide().build(),
  new RectangleBuilder(20 * 2, 80 * 2, 80 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(80 * 2, 40 * 2, 20 * 2, 40 * 2).makeCollide().build(),
  new RectangleBuilder(100 * 2, 40 * 2, 80 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(160 * 2, 0 * 2, 20 * 2, 40 * 2).makeCollide().build(),
  new RectangleBuilder(180 * 2, 0 * 2, 100 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(260 * 2, 20 * 2, 20 * 2, 80 * 2).makeCollide().build(),
  new RectangleBuilder(280 * 2, 80 * 2, 40 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(300 * 2, 100 * 2, 20 * 2, 100 * 2).makeCollide().build(),
  new RectangleBuilder(220 * 2, 180 * 2, 80 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(220 * 2, 200 * 2, 20 * 2, 40 * 2).makeCollide().build(),
  new RectangleBuilder(160 * 2, 220 * 2, 60 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(120 * 2, 200 * 2, 20 * 2, 40 * 2).makeCollide().build(),
  new RectangleBuilder(100 * 2, 140 * 2, 40 * 2, 60 * 2).makeCollide().build(),
  new RectangleBuilder(140 * 2, 140 * 2, 100 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(160 * 2, 80 * 2, 20 * 2, 60 * 2).makeCollide().build(),
  new RectangleBuilder(220 * 2, 80 * 2, 20 * 2, 60 * 2).makeCollide().build(),
  new RectangleBuilder(180 * 2, 80 * 2, 40 * 2, 20 * 2).makeCollide().build(),
  new RectangleBuilder(20 * 2, 180 * 2, 80 * 2, 20 * 2).makeCollide().build()
]

// MOVABLE WALLS
const movableWalls = []

// TRAPS
const traps = [
  new TrapSystem(
    0,
    0,
    [
      {
        traps: [
          new RectangleBuilder(200, 120, 120, 160).build(),
          new RectangleBuilder(360, 40, 160, 120).build(),
          new RectangleBuilder(480, 200, 120, 160).build(),
          new RectangleBuilder(280, 320, 160, 120).build()
        ],
        timing: new Interval('[0, 500[')
      },
      {
        traps: [
          new RectangleBuilder(320, 120, 40, 40).build(),
          new RectangleBuilder(480, 160, 40, 40).build(),
          new RectangleBuilder(440, 320, 40, 40).build(),
          new RectangleBuilder(280, 440, 40, 40).build()
        ],
        timing: new Interval('[1000, 1500]')
      }
    ],
    2000
  )
]
// traps.push(
//   new CheckerboardBuilder(600, 20)
//     .withSize(5, 1)
//     .withCellSize(50, 100)
//     .withTiming(new Interval('[0, 500['), new Interval('[1000, 1500]'))
//     .withCycleDuration(2000)
//     .build(),
//   new CheckerboardBuilder(200, 20)
//     .withSize(5, 1)
//     .withCellSize(50, 100)
//     .withTiming(new Interval('[0, 500['), new Interval('[1000, 1500]'))
//     .withCycleDuration(2000)
//     .build()
// )
// traps.push(new RectangleBuilder(20, 140, 800, 20).makeKill().build())

export default { spawn, walls, movableWalls, traps }
