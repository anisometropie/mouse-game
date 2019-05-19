const express = require('express')
const socket = require('socket.io')

const app = express()
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
app.use(express.static('public'))

const users = []

const io = socket(server)
io.on('connection', socket => {
  console.log('new connection: ' + socket.id)
  users.push(new user(socket.id))
  socket.on('mouse', data => {
    users.find(u => (u.id = socket.id)).move(data.x, data.y)
    socket.broadcast.emit('users', users)
    // io.sockets.emit("mouse", data);  // send the message to everybody, includin the emitter
  })
})

class user {
  constructor(id, x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  move(x, y) {
    this.x = x
    this.y = y
  }
}
