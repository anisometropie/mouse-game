import { pick, get } from 'lodash'

export function computeRectangle(point1, point2, size) {
  const x = Math.min(point1.x, point2.x) * size
  const y = Math.min(point1.y, point2.y) * size
  const width = size + Math.abs(point1.x - point2.x) * size
  const height = size + Math.abs(point1.y - point2.y) * size
  return { x, y, width, height }
}

/**
 * return the original data that fed the constructor
 * @param {Rectangle} rect
 */
export const extractRectangleData = rect => {
  // DEBT: store as array, not object
  return rect
    ? {
        ...pick(rect, [
          'x',
          'y',
          'width',
          'height',
          'color',
          'hasCollision',
          'kills',
          'path',
          'velocity'
        ]),
        isMovable: get(rect, 'constructor.name') === 'MovableRectangle'
      }
    : []
}
