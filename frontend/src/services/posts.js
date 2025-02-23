import axios from 'axios'
const baseUrl =
    import.meta.env.MODE === 'test'
      ? 'http://localhost:3001/api/posts'
      : '/api/posts'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const getUserPosts = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`)
  return response.data
}

const getPostsOfFollowedUsers = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const response = await axios.get(`${baseUrl}/user/following`, config)
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

const like = async (postId) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.post(`${baseUrl}/${postId}/like`, {}, config)
  return response.data
}

const unlike = async (postId) => {
  const config = {
    headers: {
      Authorization: token
    }
  }

  const response = await axios.delete(`${baseUrl}/${postId}/unlike`, config)
  return response.data
}

export default { setToken, getAll, create, getPostsOfFollowedUsers, getUserPosts, like, unlike }