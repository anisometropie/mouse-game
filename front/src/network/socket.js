import io from 'socket.io-client'
import User from 'objects/User'
import { user, users } from 'components/Game'
import { url } from './api'

const socket = io.connect(url)

export const addUser = data => {
  const {
    id,
    center: { x, y },
    radius,
    color,
    name
  } = data
  users[id] = new User(x, y, radius, color, name)
}

socket.on('SERVER_send_user_own_id', data => {
  user.id = data
})

socket.on('SERVER_send_list_of_users', data => {
  Object.values(data).forEach(user => {
    addUser(user)
  })
})

socket.on('SERVER_broadcast_new_user', data => {
  addUser(data)
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

export default socket
