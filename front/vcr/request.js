const axios = require('axios')

module.exports = async function (config) {
  const { method, url, headers, data } = config
  try {
    const resp = await axios({ method, url, headers, data })
    return resp
  } catch (err) {
    if (err.code === 'ECONNREFUSED') {
      const info = { error: err.code, address: err.address, port: err.port }
      console.log(`Error: ${err.code}. Address: ${err.address}. Port: ${err.port}`)
      return { status: 500, statusText: err.code, data: info }
    }
    if (err.response) {
      const info = { data: err.response.data, status: err.response.status, statusText: err.response.statusText }
      console.log('ERROR INFO:', info)
      return info
    }
    console.log('Unknown error caught')
  }
}
