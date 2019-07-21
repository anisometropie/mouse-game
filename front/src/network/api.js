import axios from 'axios'

export const url = 'http://localhost:3000'

export const getMap = id => {
  return axios.get(`${url}/map/${id}`).then(res => res.data)
}
