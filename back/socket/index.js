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
    })

    socket.on('PRIVATE MESSAGE', (from, msg) => {
      console.log('I received a private message by ', from, ' saying ', msg)
      console.log('CONNECTIONS:')
      console.log(connections)
    })

    socket.on('disconnect', () => {
      console.log(`Client with id '${socket.id}' and profileId '${profileId}' has disconnected`)
      connections[profileId] && connections[profileId][socket.id] && (delete connections[profileId][socket.id])
    })
  })
  return http
}
