import axios from 'axios'

const serverURL = 'http://192.168.12.108'
// const serverURL = 'http://192.168.1.216'

const serverPort = '5000'

export default axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  timeout: 4000,
  withCredentials: true,
})

export const axiosPrivate = axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  timeout: 4000,
  withCredentials: true,
})

export { serverURL }
export { serverPort }
