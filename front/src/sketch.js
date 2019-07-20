import { get } from 'lodash'

import * as server from 'network/send'
import { fpsCounter } from 'utils/FpsCounter'
import { setPointerLock } from 'engine/pointerLock'
import { getMousePos, pixelRatio } from 'utils/canvas'
import {
  circleIntersectsRectangle,
  segmentIntersectsCircle,
  resolveWorldBordersCircleCollision,
  resolveCollisionCircleRectangle,
  stepCollisionResolve
} from 'engine/physics'

import Interval from 'objects/Interval'
import Color from 'effects/Color'

import RectangleBuilder from 'objects/Rectangle'
import Vector from 'objects/Vector'
import Point from 'objects/Point'
import User from 'objects/User'
import TrapSystem from 'objects/TrapSystem'

import world1 from 'maps/1'

let world = world1
export const users = {}

export const user = new User(
  world.spawn.center.x,
  world.spawn.center.y,
  12,
  Color.random(),
  '',
  world.spawn
)

server.userConnects(user)

export const WIDTH = window.innerWidth
export const HEIGHT = window.innerHeight
const canvas = document.getElementById('canvas') || {
  getContext: () => {},
  setAttribute: () => {}
}
export const ctx = canvas.getContext('2d')
canvas.setAttribute('width', WIDTH)
canvas.setAttribute('height', HEIGHT)
setPointerLock(canvas, mouseMoved)

function mouseMoved(event) {
  const displacement = new Vector(
    event.movementX / pixelRatio,
    event.movementY / pixelRatio
  )
  user.translate(displacement)
  resolveWorldBordersCircleCollision(user)
  for (const w of world.walls) {
    if (w.hasCollision) stepCollisionResolve(user, w)
  }
  server.updateUserPosition(user)
}

function draw() {
  window.requestAnimationFrame(draw)
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillText(fpsCounter.fps, 1000, 20)
  world.walls.forEach(w => {
    if (w.hasCollision && resolveCollisionCircleRectangle(user, w)) {
      server.updateUserPosition(user)
    }
    w.display(ctx)
  })
  world.movableWalls.forEach(w => {
    w.walkPath()
    if (w.hasCollision && resolveCollisionCircleRectangle(user, w)) {
      server.updateUserPosition(user)
    }
    w.display(ctx)
  })
  world.traps.forEach(t => {
    t.display(ctx)
    if (t.hasUserFallenInTrap(user)) {
      user.kill()
      server.updateUserPosition(user)
    }
  })
  user.display(ctx, false)
  Object.values(users)
    .filter(u => u.id !== user.id)
    .forEach(u => {
      u.display(ctx, true)
    })
}
window.requestAnimationFrame(draw)
