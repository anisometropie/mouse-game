import * as p5 from 'p5'
import 'p5/lib/addons/p5.dom'
import io from 'socket.io-client'
import { get } from 'lodash'
let socket

import User from './user'
let userNameInput
let color
let user
let users = []
const P5 = new p5(sk => {
  sk.setup = () => {
    const canvas = sk.createCanvas(640, 480)
    canvas.parent(sk.select('#canvas'))
    user = new User('unamed', {
      red: sk.random(0, 255),
      green: sk.random(0, 255),
      blue: sk.random(0, 255)
    })

    socket = io.connect('http://localhost:3000')
    socket.emit('user connects', user)
    socket.on('users', data => {
      users = [...data]
    })
  }

  sk.draw = () => {
    sk.background(255)
    sk.noStroke()
    sk.fill(user.color.red, user.color.green, user.color.blue)
    sk.ellipse(sk.mouseX, sk.mouseY, 25, 25)
    const data = {
      x: sk.mouseX,
      y: sk.mouseY,
      name: sk.select('#userName').value()
    }
    socket.emit('user moves', data)
    users.forEach(u => {
      sk.fill(u.color.red, u.color.green, u.color.blue)
      sk.ellipse(u.x, u.y, 25, 25)
      sk.text(u.name, u.x + 12, u.y + 18)
    })
  }
  //
  // function otherDrawing(data) {
  //   noStroke()
  //   var rouge = map(data.x, 0, 640, 0, 255)
  //   var bleu = map(data.y, 0, 480, 0, 255)
  //   fill(data.col[0], data.col[1], data.col[2])
  //   ellipse(data.x, data.y, 25, 25)
  // }
})
