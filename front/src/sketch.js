import * as p5 from 'p5'
import io from 'socket.io-client'
let socket

let users = []
const P5 = new p5(sk => {
  sk.setup = () => {
    sk.createCanvas(640, 480)
    socket = io.connect('http://localhost:3000')
    socket.on('users', data => {
      users = [...data]
    })
  }

  sk.draw = () => {
    sk.background(255)
    sk.noStroke()
    sk.fill(200, 0, 200)
    sk.ellipse(sk.mouseX, sk.mouseY, 25, 25)
    const data = {
      x: sk.mouseX,
      y: sk.mouseY
    }
    // setTimeout(() => {
    socket.emit('mouse', data)
    // }, 500)
    // console.log(users)
    users.forEach(u => {
      sk.ellipse(u.x, u.y, 25, 25)
      sk.text(u.id, u.x, u.y)
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
