import axios from 'axios'
const websocketBaseUrl = 'http://localhost:3005/messages'
const baseUrl = 'http://localhost:3001/api/messages'

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

  const response = await axios.get(`${websocketBaseUrl}/${receiverId}`, config)
  return response.data
}

const getUnreadMessages = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.get(`${baseUrl}/unread`, config)
  return response.data
}

const markMessagesAsSeen = async (messageIds) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.put(`${baseUrl}/seen`, { messageIds }, config)
  return response.data
}

export default { setToken, getUserMessages, getUnreadMessages, markMessagesAsSeen }