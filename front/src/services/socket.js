import io from 'socket.io-client'

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
}

function getSocket () {
  return socket
}

function disconnectSocket () {
  socket && socket.emit('disconnect')
  console.log('disconnect socket')
}
