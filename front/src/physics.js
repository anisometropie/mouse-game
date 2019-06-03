import Vector from './Vector'
import Point from './Point'
import { minBy } from 'lodash'

export const isPointInRectangle = (point, rectangle) => {
  //  A—————————————B
  //  |             |
  //  |  P          |
  //  |             |
  //  D—————————————C
  const { A, B, C, D } = rectangle.vertices
  const AP = Vector.fromPoints(A, point)
  const AB = Vector.fromPoints(A, B)
  const AD = Vector.fromPoints(A, D)
  return (
    0 <= AP.dotProduct(AB) &&
    AP.dotProduct(AB) <= AB.dotProduct(AB) &&
    0 <= AP.dotProduct(AD) &&
    AP.dotProduct(AD) <= AD.dotProduct(AD)
  )
}

export const segmentIntersectsCircle = (segment, circle) => {
  const { distance } = Point.distanceToSegment(circle.coords, segment)
  return distance <= circle.radius
}

export const circleIntersectsRectangle = (circle, rectangle) => {
  const { A, B, C, D } = rectangle.vertices
  return (
    isPointInRectangle(circle.coords, rectangle) ||
    segmentIntersectsCircle([A, B], circle) ||
    segmentIntersectsCircle([B, C], circle) ||
    segmentIntersectsCircle([C, D], circle) ||
    segmentIntersectsCircle([D, A], circle)
  )
}

export const resolveCollisionCircleRectangle = (circle, rectangle) => {
  if (
    Point.distanceBetween(circle.center, rectangle.center) >
    2 * Math.max(rectangle.width, rectangle.height) + circle.radius
  ) {
    return
  }
  const { A, B, C, D } = rectangle.vertices
  const segments = [[A, B], [B, C], [C, D], [D, A]]
  const distances = segments.map(segment =>
    Point.distanceToSegment(circle.coords, segment)
  )
  if (isPointInRectangle(circle.coords, rectangle)) {
    const min = minBy(distances, 'distance')
    const displacement = Vector.fromPoints(circle.coords, min.closestPoint)
    displacement.length = displacement.length + circle.radius
    circle.move(displacement.x, displacement.y)
  } else {
    for (const d of distances) {
      if (d.distance < circle.radius) {
        const distanceToMove =
          circle.radius - Point.distanceBetween(d.closestPoint, circle.coords)
        const displacement = Vector.fromPoints(d.closestPoint, circle.coords)
        displacement.length = distanceToMove
        circle.move(displacement.x, displacement.y)
        break
      }
    }
  }

  // if center inside rectangle, distance center to border + radius
  //
}
