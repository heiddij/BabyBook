import axios from 'axios'
const baseUrl =
    import.meta.env.MODE === 'test'
      ? 'http://localhost:3001/api/users'
      : '/api/users'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const response = await axios.post(baseUrl, newObject)
  return response.data
}

export default { getAll, create }
