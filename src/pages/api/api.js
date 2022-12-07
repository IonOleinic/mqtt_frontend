import axios from 'axios'
const app = axios.create({
  baseURL: 'http://192.168.0.108:5000',
  timeout: 4000,
})
const serverURL = 'http://192.168.0.108'
const serverPort = '5000'
export { app }
export { serverURL }
export { serverPort }
