import { get, mapValues } from 'lodash'

export const pixelRatio = get(window, 'devicePixelRatio', 1)

export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

export function pixelToGrid(point, ratio) {
  return mapValues(point, n => Math.floor(n / ratio))
}

export function computeRectangle(point1, point2, size) {
  const x = Math.min(point1.x, point2.x) * size
  const y = Math.min(point1.y, point2.y) * size
  const width = size + Math.abs(point1.x - point2.x) * size
  const height = size + Math.abs(point1.y - point2.y) * size
  return { x, y, width, height }
}
