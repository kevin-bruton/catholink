import io from 'socket.io-client'
import {setStoreValue, storeCategory, sendStoreEvent, eventType} from '@store'
import {get as getRequest} from '@services/request'

export {
  connectSocket,
  getSocket,
  disconnectSocket
}

let socket

function connectSocket (profileId) {
  const backendHost = process.env.REACT_APP_API_MODE === 'VCR'
    ? 'http://localhost:5500'
    : process.env.REACT_APP_API_MODE === 'DEV'
      ? 'http://localhost:5000'
      : window.location.origin
  socket = io(backendHost)
  socket.on('connect', () => console.log('socketio connected', socket.id))
  socket.emit('PROFILE_ID', profileId)
  getRequest('messages').then(messages =>
    (messages.error) || setStoreValue(storeCategory.MESSAGES, messages)
  )
  socket.on('MSG_TO_CLIENT', (messageStr, sendResponse) => {
    sendStoreEvent(eventType.MSG_RECEIVED, JSON.parse(messageStr))
    sendResponse('OK')
    console.log('MSG_TO_CLIENT. Message received from server:', messageStr)
  })
  socket.on('MSG_STATUS_UPDATE', (messageStr, sendResponse) => {
    const message = JSON.parse(messageStr)
    console.log('MSG_STATUS_UPDATE. Message update received from server:', message.text, 'New status:', message.status)
    sendStoreEvent(eventType.MSG_STATUS_UPDATE, message)
    sendResponse('OK')
  })
}

function getSocket () {
  return socket
}

function disconnectSocket () {
  socket && socket.emit('disconnect')
  console.log('disconnect socket')
}
