const socket = require('socket.io')
const { isEmpty, get } = require('lodash')

const { server, users, maps } = require('./server')
const { withColor } = require('./utils/console')

const io = socket(server)
io.on('connection', socket => {
  socket.on('CLIENT_user_connects', data => {
    console.log('New connection', withColor(get(data, 'color'), socket.id))
    if (!isEmpty(users)) {
      socket.emit('SERVER_send_list_of_users', users)
    }
    users[socket.id] = { ...data, id: socket.id }
    socket.emit('SERVER_send_user_own_id', socket.id)
    socket.broadcast.emit('SERVER_broadcast_new_user', users[socket.id])
  })

  socket.on('CLIENT_user_moves', data => {
    const { x, y } = data
    users[socket.id] = {
      ...users[socket.id],
      center: { ...users[socket.id].center, x, y }
    }
    socket.broadcast.emit('SERVER_broadcast_user_moved', users[socket.id])
  })

  socket.on('CLIENT_user_name', data => {
    const { name } = data
    users[socket.id] = { ...users[socket.id], name }
    socket.broadcast.emit('SERVER_broadcast_user_name', users[socket.id])
    // io.sockets.emit("mouse", data);  // send the message to everybody, includin the emitter
  })

  socket.on('disconnect', () => {
    console.log(
      'diconnect',
      withColor(get(users[socket.id], 'color'), socket.id)
    )
    delete users[socket.id]
    socket.broadcast.emit('SERVER_broadcast_user_disconnect', socket.id)
  })
})
