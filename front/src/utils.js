export function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}

class FpsCounter {
  constructor() {
    if (!FpsCounter.instance) {
      this.frameCount = 0
      this.currentFps = 0
      this.loop = setInterval(this.storeFps.bind(this), 1000)
      FpsCounter.instance = this
    }
    return FpsCounter.instance
  }

  storeFps() {
    this.currentFps = this.frameCount
    this.frameCount = 0
  }

  get fps() {
    this.frameCount++
    return this.currentFps
  }
}

const fpsCounter = new FpsCounter()
export { fpsCounter }
