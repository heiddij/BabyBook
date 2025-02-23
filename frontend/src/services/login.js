import axios from 'axios'
const baseUrl =
    import.meta.env.MODE === 'test'
      ? 'http://localhost:3001/api/login'
      : '/api/login'

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
