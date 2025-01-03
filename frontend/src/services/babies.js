import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/babies'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (formdata) => {
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    }
  }

  const response = await axios.post(baseUrl, formdata, config)
  return response.data
}

const update = async (id, formdata) => {
  const config = {
    headers: {
      Authorization: token,
      'Content-Type': 'multipart/form-data',
    }
  }

  const response = await axios.put(`${baseUrl}/${id}`, formdata, config)
  return response.data
}

const deleteBaby = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, setToken, create, update, deleteBaby }
