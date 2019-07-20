import RectangleBuilder from 'objects/Rectangle/RectangleBuilder'
import Vector from 'objects/Vector'

const direction = {
  UP: -Math.PI / 2,
  RIGHT: 0,
  DOWN: Math.PI / 2,
  LEFT: Math.PI
}

class Wall {
  constructor(points, thickness) {
    const { UP, RIGHT, DOWN, LEFT } = direction
    this.rectangles = []
    let previousDirection = null
    for (let i = 0; i < points.length - 1; i++) {
      const A = points[i]
      const B = points[i + 1]
      const vector = Vector.fromPoints(A, B)
      switch (vector.angle) {
        case UP: {
          const heightCorrection = previousDirection === RIGHT ? thickness : 0
          this.rectangles.push(
            new RectangleBuilder(
              B.x,
              B.y,
              thickness,
              vector.length + heightCorrection
            )
              .makeCollide()
              .build()
          )
          break
        }
        case RIGHT: {
          const xCorrection = previousDirection === UP ? thickness : 0
          const widthCorrection = previousDirection === UP ? -thickness : 0
          this.rectangles.push(
            new RectangleBuilder(
              A.x + xCorrection,
              A.y,
              vector.length + widthCorrection,
              thickness
            )
              .makeCollide()
              .build()
          )
          break
        }
        case DOWN: {
          const yCorrection = previousDirection === LEFT ? thickness : 0
          const heightCorrection = previousDirection === LEFT ? -thickness : 0
          this.rectangles.push(
            new RectangleBuilder(
              A.x,
              A.y + yCorrection,
              thickness,
              vector.length + heightCorrection
            )
              .makeCollide()
              .build()
          )
          break
        }
        case LEFT: {
          const widthCorrection = previousDirection === DOWN ? thickness : 0
          this.rectangles.push(
            new RectangleBuilder(
              B.x,
              B.y,
              vector.length + widthCorrection,
              thickness
            )
              .makeCollide()
              .build()
          )
          break
        }
      }
      previousDirection = vector.angle
    }
  }
}

export default Wall
