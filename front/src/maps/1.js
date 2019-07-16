import RectangleBuilder from 'objects/Rectangle'
import Point from 'objects/Point'
import TrapSystem from 'objects/TrapSystem'
import Interval from 'objects/Interval'
import Color from 'effects/Color'

import crusher from 'maps/props/crusher'

const spawn = new RectangleBuilder(20, 20, 100, 100)
  .withColor(new Color('lightblue'))
  .build()

// WALLS
const walls = [spawn]
walls.push(new RectangleBuilder(0, 0, 20, 820).makeCollide().build())

// MOVABLE WALLS
const movableWalls = [...crusher]
movableWalls.push(
  new RectangleBuilder(500, 500, 20, 20)
    .makeMovable()
    .makeCollide()
    .withPath([new Point(100, 100), new Point(500, 100), new Point(300, 300)])
    .withVelocity(2)
    .build()
)

// TRAPS
const traps = []
const group1 = []
const group2 = []
for (let i = 0; i < 4; i++) {
  const even = []
  const odd = []
  for (let j = 0; j < 5; j++) {
    even.push(new RectangleBuilder(50 * i, 100 * j, 50, 50).build())
  }
  for (let j = 0; j < 4; j++) {
    odd.push(new RectangleBuilder(50 * i, 50 + 100 * j, 50, 50).build())
  }
  group1.push(...(i % 2 === 0 ? even : odd))
  group2.push(...(i % 2 === 0 ? odd : even))
}
const trapSystem = new TrapSystem(
  100,
  100,
  [
    {
      traps: group1,
      timing: new Interval('[0, 500['),
      on: true
    },
    {
      traps: group2,
      timing: new Interval('[1000, 1500]'),
      on: false
    }
  ],
  2000
)
traps.push(trapSystem)

export default { spawn, walls, movableWalls, traps }
