const vectorFromPoints = (start, end) => {
  return { x: end.x - start.x, y: end.y - start.y }
}

const dotProduct = (u, v) => {
  return u.x * v.x + u.y * v.y
}

const distance = (a, b) => {
  return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2)
}

const vectorLength = v => distance({ x: 0, y: 0 }, v)

export const isPointInRectangle = (point, rectangle) => {
  //  A          B
  //
  //     P
  //
  //  D          C
  const { A, B, C, D } = rectangle.vertices
  const AP = vectorFromPoints(A, point)
  const AB = vectorFromPoints(A, B)
  const AD = vectorFromPoints(A, D)
  return (
    0 <= dotProduct(AP, AB) &&
    dotProduct(AP, AB) <= dotProduct(AB, AB) &&
    0 <= dotProduct(AP, AD) &&
    dotProduct(AP, AD) <= dotProduct(AD, AD)
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
  const AB = vectorFromPoints(segment[0], segment[1])
  const AC = vectorFromPoints(segment[0], circle.coords)
  // is center of circle projection inside segment ?
  if (0 <= dotProduct(AC, AB) && dotProduct(AC, AB) <= dotProduct(AB, AB)) {
    const distAD = dotProduct(AC, AB) / vectorLength(AB)
    const theta = Math.acos(distAD / vectorLength(AC))
    const distCD = distAD === 0 ? vectorLength(AC) : Math.tan(theta) * distAD
    return distCD <= circle.radius
  } else {
    const BC = vectorFromPoints(segment[1], circle.coords)
    return (
      vectorLength(AC) <= circle.radius || vectorLength(BC) <= circle.radius
    )
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
