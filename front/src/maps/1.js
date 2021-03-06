import RectangleBuilder from 'objects/Rectangle'
import Wall from 'objects/complex/Wall'
import Point from 'objects/Point'
import TrapSystem from 'objects/TrapSystem'
import Interval from 'objects/Interval'
import Color from 'effects/Color'

const spawn = new RectangleBuilder(20 * 2, 100 * 2, 80 * 2, 80 * 2)
  .withColor(new Color('lightblue'))
  .build()

// WALLS
const walls = [
  ...new Wall(
    [
      new Point(240, 480),
      new Point(240, 360),
      new Point(0, 360),
      new Point(0, 160),
      new Point(160, 160),
      new Point(160, 80),
      new Point(320, 80),
      new Point(320, 0),
      new Point(520, 0),
      new Point(520, 160),
      new Point(600, 160),
      new Point(600, 360),
      new Point(440, 360),
      new Point(440, 440),
      new Point(320, 440)
    ],
    40
  ).rectangles,
  ...new Wall(
    [
      new Point(280, 280),
      new Point(440, 280),
      new Point(440, 160),
      new Point(320, 160),
      new Point(320, 280)
    ],
    40
  ).rectangles,
  new RectangleBuilder(200, 280, 80, 80).makeCollide().build(),
  // ** 2nd part **
  ...new Wall(
    [
      new Point(240, 440),
      new Point(80, 440),
      new Point(80, 520),
      new Point(40, 520),
      new Point(40, 680),
      new Point(120, 680)
    ],
    40
  ).rectangles,
  ...new Wall(
    [new Point(320, 480), new Point(320, 520), new Point(160, 520)],
    40
  ).rectangles,
  ...new Wall(
    [new Point(200, 560), new Point(200, 680), new Point(160, 680)],
    40
  ).rectangles
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
  // new TrapSystem(
  //   0,
  //   0,
  //   [
  //     {
  //       traps: [new RectangleBuilder(200, 500, 100, 400).build()],
  //       timing: new Interval('[0, 900[')
  //     },
  //     {
  //       traps: [new RectangleBuilder(300, 500, 100, 400).build()],
  //       timing: new Interval('[1000, 1900]')
  //     }
  //   ],
  //   2000
  // )
]

// CHECKPOINTS
const checkpoints = [
  new RectangleBuilder(20 * 2, 100 * 2, 80 * 2, 80 * 2)
    .withColor(new Color('lightblue'))
    .build()
]
export default { spawn, walls, movableWalls, traps, checkpoints }
