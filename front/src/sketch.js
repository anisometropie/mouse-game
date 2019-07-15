import io from 'socket.io-client'
import { get } from 'lodash'
import { fpsCounter } from 'utils/FpsCounter'
import { getMousePos } from 'utils/helpers'
import {
  circleIntersectsRectangle,
  segmentIntersectsCircle,
  resolveWorldBordersCircleCollision,
  resolveCollisionCircleRectangle
} from 'engine/physics'
import { setPointerLock } from 'engine/pointerLock'

import TrapSystem from 'objects/TrapSystem'
import Interval from 'objects/Interval'
import RectangleBuilder from 'objects/Rectangle'
import Vector from 'objects/Vector'
import Point from 'objects/Point'
import User from 'objects/user'

import Color from 'effects/Color'

const pixelRatio = get(window, 'devicePixelRatio', 1)

let userNameInput
const color = Color.random()
const user = new User('unamed', color)
let users = []
const walls = []
const movableWalls = []
const traps = []
walls.push(new RectangleBuilder(50, 200, 200, 520).makeCollide().build())
walls.push(new RectangleBuilder(450, 300, 200, 120).build())
movableWalls.push(
  new RectangleBuilder(500, 500, 20, 20)
    .makeMovable()
    .makeCollide()
    .withPath([new Point(100, 100), new Point(500, 100), new Point(300, 300)])
    .withVelocity(2)
    .build()
)
const trapSystem = new TrapSystem(
  400,
  600,
  [
    {
      traps: [new RectangleBuilder(0, 0, 100, 100).build()],
      timing: new Interval('[0, 1000['),
      on: true
    },
    {
      traps: [new RectangleBuilder(0, 100, 100, 100).build()],
      timing: new Interval('[1000, 2000]'),
      on: false
    }
  ],
  2000
)
traps.push(trapSystem)

// for (let i = 0; i < 10; i++) {
//   for (let j = 0; j < 10; j++) {
//     walls.push(new Rectangle(50 + 36 * i + 12 * j, 200 + 36 * j, 18, 12))
//   }
// }

const socket = io.connect('http://localhost:3000')
socket.emit('user connects', user)
socket.on('users', data => {
  users = data.map(d => new User(d.name, d.color, d.x, d.y))
  window.requestAnimationFrame(draw)
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
  for (const w of walls) {
    if (w.hasCollision) resolveCollisionCircleRectangle(user, w)
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
  ctx.save()
  ctx.fillStyle = '#000000'
  ctx.fillText(fpsCounter.fps, 20, 20)
  walls.forEach(w => {
    if (w.hasCollision) {
      resolveCollisionCircleRectangle(user, w)
    }
    w.display(ctx)
  })
  movableWalls.forEach(w => {
    w.walkPath()
    if (w.hasCollision) {
      resolveCollisionCircleRectangle(user, w)
    }
    w.display(ctx)
  })
  traps.forEach(t => {
    t.display(ctx)
    if (t.hasUserFallenInTrap(user)) {
      user.kill()
    }
  })
  ctx.restore()
  user.display(ctx, false)
  users
    .filter(u => u.id !== user.id)
    .forEach(u => {
      u.display(ctx, true)
    })
}
window.requestAnimationFrame(draw)
