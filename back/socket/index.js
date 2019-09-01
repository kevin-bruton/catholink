const log = require('@log/')

const messageStatus = {
  NOT_SENT: 0,
  SENT: 1,
  RECEIVED: 2,
  READ: 3
}

module.exports = function (app) {
  const http = require('http').Server(app)
  const server = require('socket.io')(http)
  const {updateStatus, saveMessage} = require('@db/messages')

  let connections = {}

  server.on('connection', function (socket) {
    let profileId
    log('SOCKET.IO: a user connected with id:', socket.id)

    socket.on('PROFILE_ID', recievedProfileId => {
      profileId = recievedProfileId
      log('SOCKET.IO: Setting profile id to', profileId)
      if (!connections[profileId]) {
        connections[profileId] = {[socket.id]: socket}
      } else {
        connections[profileId][socket.id] = socket
      }
      log('Users connected:', Object.keys(connections))
    })

    socket.on('MSG_TO_SERVER', async (messageStr, sendResponse) => {
      log('I received a message from a client:', messageStr)
      const message = JSON.parse(messageStr)
      message.status = messageStatus.SENT
      saveMessage(message)
      sendResponse('OK')
      const updatedMessage = await sendMessageToClient(message, connections)
      log('SENT MESSAGE TO DESTINATION. RECEIVED THE MESSAGE UPDATED:')
      log(updatedMessage)
      if (updatedMessage.status > message.status) {
        log(`NEW STATUS OF MESSAGE: '${updatedMessage.text}' status: '${updatedMessage.status}'`)
        updateStatus(updatedMessage._id, updatedMessage.status)
        log('Sending update to sender...')
        await sendMessageUpdateToSender(updatedMessage, connections)
      }
    })

    socket.on('MSG_STATUS_UPDATE_TO_SERVER', async (messageStr, sendResponse) => {
      sendResponse('OK')
      log('Received msg_status_update from client:', messageStr)
      const message = JSON.parse(messageStr)
      await updateStatus(message._id, message.status)
      await sendMessageUpdateToSender(message, connections)
    })

    socket.on('disconnect', () => {
      log(`Client with id '${socket.id}' and profileId '${profileId}' has disconnected`)
      connections[profileId] && connections[profileId][socket.id] && (delete connections[profileId][socket.id])
    })
  })
  return http
}

function sendMessageUpdateToSender (message, connections) {
  log(`Sending message update to sender. Sender: ${message.from}; Status: ${message.status}; Text: ${message.text}`)
  return sendMessageToConnected(message.from, 'MSG_STATUS_UPDATE', message, connections)
}

function sendMessageToClient (message, connections) {
  log(`Sending message to client receiver. Sender: ${message.from}; Status: ${message.status}; Text: ${message.text}`)
  return sendMessageToConnected(message.to, 'MSG_TO_CLIENT', message, connections)
}

async function sendMessageToConnected (to, messageType, message, connections) {
  let messageReceived = false
  log('Users connected:', Object.keys(connections), 'Send message to:', to)
  if (!connections[to]) {
    // destination user is not connected
    return false
  }
  const socketsToSendOn = connections[to]
  for (let i = 0; i < Object.keys(socketsToSendOn).length; i++) {
    const clientResponse = await sendMessage(socketsToSendOn[Object.keys(socketsToSendOn)[i]], messageType, message)
    if (clientResponse === 'OK') messageReceived = true
  }
  if (messageReceived) log(`SENT ${messageType} message to ${to} with status ${message.status} and messageText: ${message.text}`)
  return messageReceived ? Object.assign({}, message, {status: messageStatus.RECEIVED}) : message
}

function sendMessage (socket, eventName, message) {
  return new Promise(resolve =>
    socket.emit(eventName, JSON.stringify(message), clientResponse => resolve(clientResponse))
  )
}
