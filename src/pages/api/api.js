import axios from 'axios'

const serverURL = 'http://localhost'
const serverPort = '5000'

export default axios.create({
  baseURL: `${serverURL}:${serverPort}`,
})

export const axiosPrivate = axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export { serverURL }
export { serverPort }
