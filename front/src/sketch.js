import io from 'socket.io-client'
import { get, random } from 'lodash'
import { getMousePos } from './utils'
import { circleIntersectsRectangle, segmentIntersectsCircle } from './physics'

import Rectangle from './Rectangle'
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
const rectangle = new Rectangle(100, 100, 100, 100)

const socket = io.connect('http://localhost:3000')
socket.emit('user connects', user)
socket.on('users', data => {
  users = data.map(d => new User(d.name, d.color, d.x, d.y))
  window.requestAnimationFrame(draw)
})
socket.on('send user own id', data => {
  user.id = data
})

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight
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
  const { radius } = user
  let newX = user.coords.x + event.movementX / pixelRatio
  let newY = user.coords.y + event.movementY / pixelRatio
  if (newX > WIDTH - radius) {
    newX = WIDTH - radius
  }
  if (newX < radius) {
    newX = radius
  }
  if (newY > HEIGHT - radius) {
    newY = HEIGHT - radius
  }
  if (newY < radius) {
    newY = radius
  }
  user.moveTo(newX, newY)
  const data = {
    newX,
    newY,
    name: document.getElementById('userName').value
  }
  socket.emit('user moves', data)
  window.requestAnimationFrame(draw)
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = circleIntersectsRectangle(user, rectangle) ? 'green' : 'red'
  rectangle.display(ctx)
  user.display(ctx, false)
  users
    .filter(u => u.id !== user.id)
    .forEach(u => {
      u.display(ctx, true)
    })
}
window.requestAnimationFrame(draw)
