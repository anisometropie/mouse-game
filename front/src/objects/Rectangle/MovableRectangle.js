import Rectangle from './Rectangle'
import Vector from 'objects/Vector'

class MovableRectangle extends Rectangle {
  constructor(
    x,
    y,
    width,
    height,
    hasCollision = false,
    kills = false,
    path = [],
    velocity = 0
  ) {
    super(x, y, width, height, hasCollision, kills)
    this.path = path
    this.velocity = path.length > 1 ? velocity : 0
    this.currentPathIndex = 0
    if (path.length > 1) {
      this.velocityVector = Vector.fromPoints(
        path.slice(this.currentPathIndex, 2)
      )
      this.velocityVector.length = velocity
    }
  }

  static translate(rectangle, vector) {
    for (let vertice of Object.values(rectangle.vertices)) {
      vertice.translate(vector)
    }
    rectangle.center.translate(vector)
  }

  translate(vector) {
    MovableRectangle.translate(this, vector)
  }
}

export default MovableRectangle
