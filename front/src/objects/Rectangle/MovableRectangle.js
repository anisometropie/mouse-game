import Rectangle from './Rectangle'
import Vector from 'objects/Vector'

class MovableRectangle extends Rectangle {
  constructor(
    x,
    y,
    width,
    height,
    color,
    hasCollision = false,
    kills = false,
    path = [],
    velocity = 0
  ) {
    super(
      path[0] ? path[0].x : x,
      path[0] ? path[0].y : y,
      width,
      height,
      color,
      hasCollision,
      kills
    )
    this.path = path
    this.velocity = path.length > 1 ? velocity : 0
    this.currentPathIndex = -1
    if (path.length > 1) {
      this.selectNextPathSegment()
    }
  }

  selectNextPathSegment() {
    this.currentPathIndex = (this.currentPathIndex + 1) % this.path.length
    this.currentSegmentStart = this.path[this.currentPathIndex]
    this.currentSegmentEnd = this.path[
      (this.currentPathIndex + 1) % this.path.length
    ]
    this.currentSegment = Vector.fromPoints(
      this.currentSegmentStart,
      this.currentSegmentEnd
    )
    this.velocityVector = this.currentSegment.clone()
    this.velocityVector.length = this.velocity
  }

  walkPath() {
    this.translate(this.velocityVector)
    const positionVector = Vector.fromPoints(this.currentSegmentStart, this.A)
    if (positionVector.length >= this.currentSegment.length) {
      this.selectNextPathSegment()
    }
  }
}

export default MovableRectangle
