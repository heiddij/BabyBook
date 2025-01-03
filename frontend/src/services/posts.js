import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/posts'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getUserPosts = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.get(`${baseUrl}/own`, config)
  return response.data
}

const getPostsOfFollowedUsers = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.get(`${baseUrl}/following`, config)
  return response.data
}

const create = async (babyId, formdata) => {
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    }
  }

  const response = await axios.post(`${baseUrl}/${babyId}`, formdata, config)
  return response.data
}

export default { setToken, getAll, create, getPostsOfFollowedUsers, getUserPosts }