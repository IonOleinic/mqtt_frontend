import io from 'socket.io-client'
import { serverPort, serverURL } from './api.js'
let socket = undefined

function initSocket(__bool) {
  if (__bool) {
    if (!socket) {
      socket = io.connect(`${serverURL}:${serverPort}`, {
        secure: false,
        forceNew: true,
      })
      socket.on('connect', function () {
        console.log('connected')
      })
      socket.on('disconnect', function () {
        console.log('disconnected')
      })
    } else {
      socket.connect()
      console.log('reconected')
    }
  } else {
    socket.disconnect()
  }
}
initSocket(true)
export { socket }
