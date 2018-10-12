const request = require('./request')
const path = require('path')
const hash = require('object-hash')
const fs = require('fs')
const mode = require('./mode')

module.exports = config => {
  return async function (req, res, next) {
    const requestData = {
      method: req.method,
      headers: getRequestHeaders(req),
      data: req.body,
      url: config.remoteUrl + req.originalUrl
    }
    console.log('Request received for', requestData.url, 'via', requestData.method)
    const filepath = getRecordingFilePath(config.dir, config.remoteUrl, req.originalUrl, requestData)
    if (config.mode === mode.RECORD) {
      console.log('  In recording mode. Making the request to remote...')
      const responseData = await makeRequestAndSave(filepath, requestData)
      res.send(responseData)
    } else {
      const recordingExists = fs.existsSync(filepath)
      if (recordingExists) {
        console.log('  Recording found. Not in recording mode. Sending recording back...')
        const recording = JSON.parse(fs.readFileSync(filepath))
        if (recording.response.status !== 200) res.status(recording.response.status).send(recording.response.statusText)
        else res.status(recording.response.status).send(recording.response.data)
      } else if (config.mode === mode.PLAYBACK) {
        console.log('  Recording not found. In playback mode. Sending back a 404...')
        res.sendStatus(404)
      } else if (config.mode === mode.CACHE) {
        console.log('  Recording not found. In cache mode. Making the request to remote...')
        const responseData = await makeRequestAndSave(filepath, requestData)
        res.send(responseData)
      }
    }
    next()
  }
}

async function makeRequestAndSave (filepath, requestData) {
  const response = await request(requestData)
  const resp = { status: response.status, statusText: response.statusText, data: response.data }
  save(filepath, requestData, resp)
  return response.data
}

function getRequestHeaders (req) {
  const headersTitles = [ 'Content-Type', 'Authorization' ]
  return headersTitles.reduce((headers, title) => {
    req.get(title) && (headers[title] = req.get(title))
    return headers
  }, {})
}

function save (filepath, requestData, response) {
  function ensureDirExists (filePath) {
    var dirname = path.dirname(filePath)
    if (fs.existsSync(dirname)) {
      return true
    }
    ensureDirExists(dirname)
    fs.mkdirSync(dirname)
  }
  ensureDirExists(filepath)
  const toSave = { request: requestData, response }
  fs.writeFileSync(filepath, JSON.stringify(toSave, null, 2))
}

function getRecordingFilePath (configDir, remoteUrl, originalUrl, requestData) {
  originalUrl.startsWith('/') && (originalUrl = originalUrl.substring(1))
  const dir = path.join(__dirname, configDir, remoteUrl.replace('http://', '').replace('/', '-').replace(':', '-'), originalUrl.replace('/', '-'), requestData.method)
  return path.join(dir, hash(requestData.data) + '.json')
}
