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

    const filepath = getRecordingFilePath(config.dir, config.remoteUrl, req.originalUrl, requestData, config.dataFilter4FileHash)

    if (config.mode === mode.RECORD) {
      console.log(`${requestData.method} ${requestData.url}: RECORD MODE. REQUESTING...`)
      const responseData = await makeRequest(requestData)
      save(filepath, requestData, responseData)
      sendResponse(responseData, res)
    } else {
      if (recordingExists(filepath)) {
        console.log(`${requestData.url} ${requestData.method}: ${config.mode} MODE; HIT`)
        const recording = getRecording(filepath)
        sendResponse(recording.response, res)
      } else if (config.mode === mode.PLAYBACK) {
        console.log(`${requestData.method} ${requestData.url}: ${config.mode} MODE; NO HIT. RETURNING 404...`)
        res.sendStatus(404)
      } else {
        console.log(`${requestData.method} ${requestData.url}: ${config.mode} MODE; NO HIT. REQUESTING...`)
        const responseData = await makeRequest(requestData)
        save(filepath, requestData, responseData)
        sendResponse(responseData, res)
      }
    }
    next()
  }
}

function getRecording (filepath) {
  return JSON.parse(fs.readFileSync(filepath))
}

function recordingExists (filepath) {
  return fs.existsSync(filepath)
}

function sendResponse (response, res) {
  res.status(response.status).send(response.data)
}

async function makeRequest (requestData) {
  return request(requestData)
}

function getRequestHeaders (req) {
  const headersTitles = [ 'Content-Type', 'Authorization' ]
  return headersTitles.reduce((headers, title) => {
    req.get(title) && (headers[title] = req.get(title))
    return headers
  }, {})
}

function save (filepath, requestData, resp) {
  const response = { status: resp.status, statusText: resp.statusText, data: resp.data }
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

function getRecordingFilePath (configDir, remoteUrl, originalUrl, requestData, dataFilter4FileHash) {
  originalUrl.startsWith('/') && (originalUrl = originalUrl.substring(1))
  const dir = path.join(__dirname, configDir, remoteUrl.replace('http://', '').replace('/', '-').replace(':', '-'), originalUrl.replace('/', '-'), requestData.method)
  return path.join(dir, hashOnData(requestData.data, dataFilter4FileHash) + '.json')
}

function hashOnData (data, dataFilter4FileHash) {
  const newData = dataFilter4FileHash(data)
  return hash(newData)
}
