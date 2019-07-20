import RectangleBuilder from 'objects/Rectangle'
import Point from 'objects/Point'
import TrapSystem from 'objects/TrapSystem'
import Interval from 'objects/Interval'
import Color from 'effects/Color'

import crusher from 'objects/complex/crusher'
import CheckerboardBuilder from 'objects/complex/CheckerboardBuilder'

const spawn = new RectangleBuilder(20, 20, 100, 100)
  .withColor(new Color('lightblue'))
  .build()

// WALLS
const walls = [
  spawn,
  // new RectangleBuilder(0, 0, 20, 900).makeCollide().build(),
  // new RectangleBuilder(20, 0, 900, 20).makeCollide().build(),
  // new RectangleBuilder(20, 120, 900, 20).makeCollide().build()
  new RectangleBuilder(100, 100, 40, 900).makeCollide().build(),
  new RectangleBuilder(400, 100, 40, 900).makeCollide().build(),
  new RectangleBuilder(800, 100, 40, 900).makeCollide().build()
]

// MOVABLE WALLS
const movableWalls = [
  // ...crusher,
  // new RectangleBuilder(500, 500, 20, 20)
  //   .makeMovable()
  //   .makeCollide()
  //   .withPath([new Point(100, 100), new Point(500, 100), new Point(300, 300)])
  //   .withVelocity(2)
  //   .build()
]

// TRAPS
const traps = [
  // new CheckerboardBuilder(600, 20)
  //   .withSize(5, 1)
  //   .withCellSize(50, 100)
  //   .withTiming(new Interval('[0, 500['), new Interval('[1000, 1500]'))
  //   .withCycleDuration(2000)
  //   .build(),
  // new CheckerboardBuilder(200, 20)
  //   .withSize(5, 1)
  //   .withCellSize(50, 100)
  //   .withTiming(new Interval('[0, 500['), new Interval('[1000, 1500]'))
  //   .withCycleDuration(2000)
  //   .build(),
  // new RectangleBuilder(20, 140, 800, 20).makeKill().build()
]

export default { spawn, walls, movableWalls, traps }
