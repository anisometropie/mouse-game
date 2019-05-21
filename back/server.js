const express = require('express')
const socket = require('socket.io')

const app = express()
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
app.use(express.static('public'))

const users = {}

const io = socket(server)
io.on('connection', socket => {
  socket.on('user connects', data => {
    console.log('connect', socket.id)
    users[socket.id] = { ...data, id: socket.id }
    socket.emit('send user own id', socket.id)
  })

  socket.on('user moves', data => {
    users[socket.id] = { ...users[socket.id], ...data }
    socket.broadcast.emit('users', Object.values(users))
    // io.sockets.emit("mouse", data);  // send the message to everybody, includin the emitter
  })

  socket.on('disconnect', () => {
    console.log('diconnect', socket.id)
    delete users[socket.id]
    socket.broadcast.emit('users', Object.values(users))
  })
})
