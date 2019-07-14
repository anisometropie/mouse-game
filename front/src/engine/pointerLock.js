export function setPointerLock(canvas, mouseMoved) {
  canvas.requestPointerLock =
    canvas.requestPointerLock || canvas.mozRequestPointerLock
  document.exitPointerLock =
    document.exitPointerLock || document.mozExitPointerLock
  canvas.onclick = canvas.requestPointerLock
  document.addEventListener('pointerlockchange', lockChangeAlert, false)
  document.addEventListener('mozpointerlockchange', lockChangeAlert, false)

  function lockChangeAlert() {
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas
    ) {
      document.addEventListener('mousemove', mouseMoved, false)
    } else {
      document.removeEventListener('mousemove', mouseMoved, false)
    }
  }
}
