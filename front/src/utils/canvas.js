import { get, mapValues } from 'lodash'

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

export const pixelRatio = get(window, 'devicePixelRatio', 1)
