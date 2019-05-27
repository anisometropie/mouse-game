import io from 'socket.io-client'
import { get, random } from 'lodash'
import { getMousePos } from './utils'
import { isPointInRectangle } from './physics'

import Rectangle from './Rectangle'
import User from './user'

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
canvas.addEventListener('mousemove', mouseMoved)

function mouseMoved(event) {
  const { x, y } = getMousePos(canvas, event)
  user.move(x, y)
  const data = {
    x,
    y,
    name: document.getElementById('userName').value
  }
  socket.emit('user moves', data)
  window.requestAnimationFrame(draw)
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = isPointInRectangle(user.coords, rectangle) ? 'green' : 'red'
  rectangle.display(ctx)
  user.display(ctx, false)
  users
    .filter(u => u.id !== user.id)
    .forEach(u => {
      u.display(ctx, true)
    })
}
window.requestAnimationFrame(draw)
