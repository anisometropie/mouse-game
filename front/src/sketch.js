import io from 'socket.io-client'
import { get, random } from 'lodash'
import { getMousePos } from './utils'
import {
  circleIntersectsRectangle,
  segmentIntersectsCircle,
  resolveWorldBordersCircleCollision,
  resolveCollisionCircleRectangle
} from './physics'

import Rectangle from './Rectangle'
import Vector from './Vector'
import Point from './Point'

import User from './user'

const pixelRatio = get(window, 'devicePixelRatio', 1)

let userNameInput
const color = {
  red: random(0, 255),
  green: random(0, 255),
  blue: random(0, 255)
}
const user = new User('unamed', color)
let users = []
const walls = []
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    walls.push(new Rectangle(50 + 36 * i + 12 * j, 200 + 36 * j, 18, 12))
  }
}

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
const canvas = document.getElementById('canvas')
export const ctx = canvas.getContext('2d')
canvas.setAttribute('width', WIDTH)
canvas.setAttribute('height', HEIGHT)

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

function mouseMoved(event) {
  const displacement = new Vector(
    event.movementX / pixelRatio,
    event.movementY / pixelRatio
  )
  user.translate(displacement)
  resolveWorldBordersCircleCollision(user)
  console.log(user.coords)
  const newPosition = new Point(
    user.coords.x + displacement.x,
    user.coords.y + displacement.y
  )

  // const { previousX, previousY } = user.coords
  // const steps = 10
  // mainLoop: for (let t = 1 / steps; t <= 1; t += 1 / steps) {
  //   user.move(
  //     previousX + t * (newPosition.x - previousX),
  //     previousY + t * (newPosition.y - previousY)
  //   )
  //   for (const w of walls) {
  //     if (resolveCollisionCircleRectangle(user, w)) {
  //       break mainLoop
  //     }
  //   }
  // }

  const data = {
    newX: user.coords.x,
    newY: user.coords.y,
    name: document.getElementById('userName').value
  }
  socket.emit('user moves', data)
  window.requestAnimationFrame(draw)
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.save()
  ctx.fillStyle = '#000000'
  walls.forEach(w => {
    w.display(ctx)
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
