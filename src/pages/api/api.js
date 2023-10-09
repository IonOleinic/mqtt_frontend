import axios from 'axios'
// const serverURL = 'http://192.168.1.115'
const serverURL = 'http://localhost'
const serverPort = '5000'
const app = axios.create({
  baseURL: `${serverURL}:${serverPort}`,
  timeout: 4000,
})
export { app }
export { serverURL }
export { serverPort }
