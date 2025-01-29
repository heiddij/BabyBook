import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/comments'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getPostComments = async (postId) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.get(`${baseUrl}/${postId}`, config)
  return response.data
}

const create = async (postId, comment) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.post(`${baseUrl}/${postId}`, { content: comment }, config)
  return response.data
}

export default { setToken, getPostComments, create }