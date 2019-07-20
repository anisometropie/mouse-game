const express = require('express')
const socket = require('socket.io')
const chalk = require('chalk')
const { isEmpty, get } = require('lodash')

const { withColor } = require('./utils/console.js')

const app = express()
const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT || 3000}`)
})
app.use(express.static('public'))

const users = {}

const io = socket(server)
io.on('connection', socket => {
  socket.on('user connects', data => {
    console.log('New connection', withColor(get(data, 'color'), socket.id))
    users[socket.id] = { ...data, id: socket.id }
    socket.emit('send user own id', socket.id)
  })

  socket.on('user moves', data => {
    users[socket.id] = { ...users[socket.id], ...data }
    socket.broadcast.emit('users', Object.values(users))
    // io.sockets.emit("mouse", data);  // send the message to everybody, includin the emitter
  })

  socket.on('disconnect', () => {
    console.log(
      'diconnect',
      withColor(get(users[socket.id], 'color'), socket.id)
    )
    delete users[socket.id]
    socket.broadcast.emit('users', Object.values(users))
  })
})
