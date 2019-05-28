import Vector from './Vector'
import Point from './Point'

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
  // AB segment
  // C circle center
  //
  //        C
  //        |
  //        |
  // A——————D—————————B
  //
  //
  const AB = Vector.fromPoints(segment[0], segment[1])
  const AC = Vector.fromPoints(segment[0], circle.coords)
  // is D inside segment ?
  if (0 <= AC.dotProduct(AB) && AC.dotProduct(AB) <= AB.dotProduct(AB)) {
    const distAD = AC.dotProduct(AB) / AB.length
    const theta = Math.acos(distAD / AC.length)
    const distCD = distAD === 0 ? AC.length : Math.tan(theta) * distAD
    return distCD <= circle.radius
  } else {
    const BC = Vector.fromPoints(segment[1], circle.coords)
    return AC.length <= circle.radius || BC.length <= circle.radius
  }
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

export const circleRectangeCollision = (circle, rectangle) => {}
