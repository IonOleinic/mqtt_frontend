import axios from 'axios'

const serverURL = 'http://localhost'
// const serverURL = 'http://192.168.12.108'

const serverPort = '5000'

export default axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export const axiosPrivate = axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  withCredentials: true,
})

export { serverURL }
export { serverPort }
