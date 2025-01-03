import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/follow'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const follow = async (id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.post(`${baseUrl}/${id}`, {}, config)
  return response.data
}

const unfollow = async (id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { setToken, follow, unfollow }