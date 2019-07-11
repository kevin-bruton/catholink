module.exports = {
  start,
  stop
}

const {spawn} = require('child_process')
let serverProcess

function start () {
  serverProcess = spawn('node', ['../server'])
  const serverStarted = () => new Promise(resolve => serverProcess.stdout.on('data', data => data.toString().includes('Server is running on PORT 5000...') && resolve()))
  return serverStarted()
}

function stop () {
  serverProcess.kill()
}
