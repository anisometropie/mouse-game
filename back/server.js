const express = require('express')
const socket = require('socket.io')

const app = express()
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
app.use(express.static('public'))

const io = socket(server)
io.sockets.on('connection', () => {
  console.log('new connection: ' + socket.id)
  socket.on('mouse', data => {
    socket.broadcast.emit('mouse', data)
    // io.sockets.emit("mouse", data);  // send the message to everybody, includin the emitter
  })
})
