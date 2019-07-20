import io from 'socket.io-client'
import { get } from 'lodash'

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

let userNameInput
const user = new User(
  world.spawn.center.x,
  world.spawn.center.y,
  12,
  Color.random(),
  '',
  world.spawn
)

let users = []

const socket = io.connect('http://localhost:3000')
socket.emit('user connects', user)
socket.on('users', data => {
  users = data.map(d => new User(d.x, d.y, d.radius, d.color, d.name))
})
socket.on('send user own id', data => {
  user.id = data
})

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
  const data = {
    newX: user.coords.x,
    newY: user.coords.y,
    name: document.getElementById('userName').value
  }
  socket.emit('user moves', data)
}

function draw() {
  window.requestAnimationFrame(draw)
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillText(fpsCounter.fps, 1000, 20)
  world.walls.forEach(w => {
    if (w.hasCollision) {
      resolveCollisionCircleRectangle(user, w)
    }
    w.display(ctx)
  })
  world.movableWalls.forEach(w => {
    w.walkPath()
    if (w.hasCollision) {
      resolveCollisionCircleRectangle(user, w)
    }
    w.display(ctx)
  })
  world.traps.forEach(t => {
    t.display(ctx)
    if (t.hasUserFallenInTrap(user)) {
      user.kill()
    }
  })
  user.display(ctx, false)
  users
    .filter(u => u.id !== user.id)
    .forEach(u => {
      u.display(ctx, true)
    })
}
window.requestAnimationFrame(draw)
