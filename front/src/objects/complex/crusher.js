import RectangleBuilder from 'objects/Rectangle'
import Point from 'objects/Point'

export default [
  new RectangleBuilder(100, 600, 100, 100)
    .makeMovable()
    .makeCollide()
    .withPath([new Point(100, 600), new Point(200, 600)])
    .withVelocity(2)
    .build(),
  new RectangleBuilder(400, 600, 100, 100)
    .makeMovable()
    .makeCollide()
    .withPath([new Point(400, 600), new Point(300, 600)])
    .withVelocity(2)
    .build()
]
