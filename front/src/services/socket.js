import io from 'socket.io-client'
import {setStoreValue, storeCategory} from '@store'
import {get as getRequest} from '@services/request'

export {
  connectSocket,
  getSocket,
  disconnectSocket
}

let socket

function connectSocket (profileId) {
  socket = io('http://localhost:5000')
  socket.on('connect', () => console.log('socketio connected', socket.id))
  socket.emit('PROFILE_ID', profileId)
  getRequest('messages').then(messages =>
    (messages.error) || setStoreValue(storeCategory.MESSAGES, messages)
  )
}

function getSocket () {
  return socket
}

function disconnectSocket () {
  socket && socket.emit('disconnect')
  console.log('disconnect socket')
}
