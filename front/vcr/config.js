const MODE = require('./mode')

module.exports = {
  remoteUrl: 'http://localhost:5000',
  dir: 'recordings',
  defaultMode: MODE.PLAYBACK,
  port: 5500,
  dataFilter4FileHash: (data) => {
    data = data || {}
    if (data.date) { // Don't fetch again if the only difference is the date
      const newData = Object.assign({}, data)
      delete newData.date
      return newData
    }
    return data
  }
}
