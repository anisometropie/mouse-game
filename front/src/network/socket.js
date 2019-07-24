import io from 'socket.io-client'
import User from 'objects/User'
import { url } from './api'

const socket = io(url)

export const addUser = (data, users) => {
  const {
    id,
    center: { x, y },
    radius,
    color,
    name
  } = data
  users[id] = new User(x, y, radius, color, name)
}

export const openConnection = (user, users) => {
  socket.connect()
  socket.on('SERVER_send_user_own_id', data => {
    user.id = data
  })

  socket.on('SERVER_send_list_of_users', data => {
    Object.values(data).forEach(newUser => {
      addUser(newUser, users)
    })
  })

  socket.on('SERVER_broadcast_new_user', newUser => {
    addUser(newUser, users)
  })

  socket.on('SERVER_broadcast_user_moved', data => {
    const {
      id,
      center: { x, y }
    } = data
    users[id].move(x, y)
  })

  socket.on('SERVER_broadcast_user_name', data => {
    const { id, name } = data
    users[id].setName(name)
  })

  socket.on('SERVER_broadcast_user_disconnect', id => {
    delete users[id]
  })
}

export const closeConnection = () => {
  socket.close()
}

export default socket
