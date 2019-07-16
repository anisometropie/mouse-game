import { get } from 'lodash'
export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

export const pixelRatio = get(window, 'devicePixelRatio', 1)
