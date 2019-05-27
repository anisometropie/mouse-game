const vectorFromPoints = (start, end) => {
  return { x: end.x - start.x, y: end.y - start.y }
}

const dotProduct = (u, v) => {
  return u.x * v.x + u.y * v.y
}

export const isPointInRectangle = (point, rectangle) => {
  //  A          B
  //
  //     P
  //
  //  D          C
  const { vertices } = rectangle
  const AP = vectorFromPoints(vertices[0], point)
  const AB = vectorFromPoints(vertices[0], vertices[1])
  const AD = vectorFromPoints(vertices[0], vertices[3])
  return (
    0 <= dotProduct(AP, AB) &&
    dotProduct(AP, AB) <= dotProduct(AB, AB) &&
    0 <= dotProduct(AP, AD) &&
    dotProduct(AP, AD) <= dotProduct(AD, AD)
  )
}
