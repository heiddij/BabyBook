import axios from 'axios'
const baseUrl = 'http://localhost:3005/messages'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getUserMessages = async (receiverId) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.get(`${baseUrl}/${receiverId}`, config)
  return response.data
}

export default { setToken, getUserMessages }