import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/posts'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then((response) => response.data)
}
  
const create = async (babyId, formdata) => {
    const config = {
        headers: { 
        Authorization: token,
        "Content-Type": "multipart/form-data",
        }
    }

    const response = await axios.post(`${baseUrl}/${babyId}`, formdata, config)
    return response.data
}

export default { setToken, getAll, create }