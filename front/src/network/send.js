import socket from 'network/socket'

export const userConnects = user => {
  socket.emit('CLIENT_user_connects', user)
}

export const updateUserPosition = user => {
  const { x, y } = user.coords
  const data = {
    x,
    y
  }
  socket.emit('CLIENT_user_moves', data)
}

export const updateUserName = user => {
  const { name } = user
  const data = {
    name
  }
  socket.emit('CLIENT_user_name', data)
}
