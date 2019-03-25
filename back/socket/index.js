module.exports = function (app) {
  const http = require('http').Server(app)
  const server = require('socket.io')(http)
  let connections = {}

  server.on('connection', function (socket) {
    let profileId
    console.log('SOCKET.IO: a user connected with id:', socket.id)

    socket.on('PROFILE_ID', recievedProfileId => {
      profileId = recievedProfileId
      console.log('SOCKET.IO: Setting profile id to', profileId)
      if (!connections[profileId]) {
        connections[profileId] = {[socket.id]: socket}
      } else {
        connections[profileId][socket.id] = socket
      }
      console.log('Users connected:', Object.keys(connections))
    })

    socket.on('PRIVATE_MESSAGE', (messageStr, sendResponse) => {
      console.log('I received a private message:', messageStr)
      const message = JSON.parse(messageStr)
      message.status = 'sent'
      sendMessageToConnected(message, connections)
        .then(updatedMessage => {
          // saveUpdatedMessageToDB()
        })
      sendResponse('sent')
    })

    socket.on('disconnect', () => {
      console.log(`Client with id '${socket.id}' and profileId '${profileId}' has disconnected`)
      connections[profileId] && connections[profileId][socket.id] && (delete connections[profileId][socket.id])
    })
  })
  return http
}

async function sendMessageToConnected (message, connections) {
  const to = message.to
  let updatedMessage
  console.log('Users connected:', Object.keys(connections))
  console.log('Send message to', to)
  const socketsToSendOn = connections[to]
  for (let i = 0; i < Object.keys(socketsToSendOn).length; i++) {
    updatedMessage = await sendMessage(socketsToSendOn[Object.keys(socketsToSendOn)[i]], 'MESSAGE_TO_CLIENT', message)
  }
  return updatedMessage
}

function sendMessage (socket, eventName, message) {
  return new Promise(resolve => {
    socket.emit(eventName, JSON.stringify(message), clientResponse =>
      clientResponse === 'OK'
        ? resolve(Object.assign({}, message, {status: 'received'}))
        : resolve(Object.assign({}, message, {status: 'failed'}))
    )
  })
}
