import Vector from 'objects/Vector'
import Point from 'objects/Point'
import { minBy, maxBy } from 'lodash'

import { WIDTH, HEIGHT } from 'sketch'

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

export const resolveWorldBordersCircleCollision = circle => {
  const { center, radius } = circle
  if (center.x > WIDTH - radius) {
    center.setX(WIDTH - radius)
  }
  if (center.x < radius) {
    center.setX(radius)
  }
  if (center.y > HEIGHT - radius) {
    center.setY(HEIGHT - radius)
  }
  if (center.y < radius) {
    center.setY(radius)
  }
}

export const resolveCollisionCircleRectangle = (circle, rectangle) => {
  if (
    Point.distanceBetween(circle.coords, rectangle.center) >
    Math.max(rectangle.width, rectangle.height) + circle.radius
  ) {
    return false
  }
  const { A, B, C, D } = rectangle.vertices
  const segments = [[A, B], [B, C], [C, D], [D, A]]
  const distancesToEdges = segments.map(segment =>
    Point.distanceToSegment(circle.coords, segment)
  )
  // CIRCLE CENTER IS INSIDE RECTANGLE
  // take the 4 distance to the center of the circle to each segments
  // resolve in the direction of the closest segment
  if (isPointInRectangle(circle.coords, rectangle)) {
    const min = minBy(distancesToEdges, 'distance')
    const displacement = Vector.fromPoints(circle.coords, min.closestPoint)
    displacement.length = displacement.length + circle.radius
    circle.translate(displacement.x, displacement.y)
    return true
  }
  // CIRCLE CENTER IS OUTSIDE
  else {
    const max = maxBy(
      distancesToEdges.filter(d => d.distance < circle.radius),
      'distance'
    )
    if (max) {
      const distanceToMove =
        circle.radius - Point.distanceBetween(max.closestPoint, circle.coords)
      const displacement = Vector.fromPoints(max.closestPoint, circle.coords)
      displacement.length = distanceToMove
      circle.translate(displacement.x, displacement.y)
      return true
    }
  }
}

export const stepCollisionResolve = (circle, rectangle) => {
  const steps = 4
  const previousPos = new Point(
    circle.center.previousX,
    circle.center.previousY
  )
  const mainDisplacement = Vector.fromPoints(previousPos, circle.coords)
  const stepDisplacement = Vector.fromPolar(
    mainDisplacement.length / steps,
    mainDisplacement.angle
  )
  circle.move(previousPos)
  for (let i = 0; i < steps; i++) {
    circle.translate(stepDisplacement)
    if (circleIntersectsRectangle(circle, rectangle)) {
      resolveCollisionCircleRectangle(circle, rectangle)
      break
    }
  }
  circle.center.previousX = previousPos.x
  circle.center.previousY = previousPos.y
}
