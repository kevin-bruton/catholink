const axios = require('axios')
const log = require('@log/')
module.exports = {
  getRequest,
  postRequest
}

async function getRequest (url) {
  return call('get', url)
}

async function postRequest (url, data) {
  return call('get', url, data)
}

async function call (method, url, data) {
  try {
    const resp = await axios({ method, url, data })
    if (resp.status !== 200) {
      log('Problem while requesting', url, resp.statusText, resp.data)
      return { error: resp.statusText }
    } else {
      log(`Successfully requested ${url}${data ? 'with data ' + data : ''}`)
      return resp.data
    }
  } catch (err) {
    log('Error found while retrieving evangelizo gospel')
    return { error: err }
  }
}
